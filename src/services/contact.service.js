const pool = require('../db');

// find or create and return contact linkage group
async function identifyContact({ email, phoneNumber }) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // fetch contacts where either email or number matches
    const { rows: contactMatch } = await client.query(
      `SELECT * FROM contacts
       WHERE (email = $1 OR phone_number = $2)
       AND deleted_at IS NULL`,
      [email, phoneNumber]
    );

    // if no match: create new primary contact
    if (contactMatch.length === 0) {
      const { rows: [newContact] } = await client.query(
        `INSERT INTO contacts (email, phone_number)
         VALUES ($1, $2)
         RETURNING *`,
        [email, phoneNumber]
      );

      await client.query('COMMIT');
      return formatResponse([newContact]);
    }

    // find the oldest primary contact in the chain
    let primaryContact = contactMatch.find(c => c.link_precedence === 'primary');

    if (!primaryContact) {
      // fallback: matched only secondary, get the primary via linked_id
      const { rows: [actualPrimary] } = await client.query(
        `SELECT * FROM contacts WHERE id = $1`,
        [contactMatch[0].linked_id]
      );
      primaryContact = actualPrimary;
    }

    // check if this exact contact already exists
    const alreadyExists = contactMatch.some(
      c => c.email === email && c.phone_number === phoneNumber
    );

    let newContact = null;
    if (!alreadyExists) {
      const { rows: [inserted] } = await client.query(
        `INSERT INTO contacts (email, phone_number, linked_id, link_precedence)
         VALUES ($1, $2, $3, 'secondary')
         RETURNING *`,
        [email, phoneNumber, primaryContact.id]
      );
      newContact = inserted;
    }

    // fetch all contacts linked to this primary
    const { rows: linked } = await client.query(
      `SELECT * FROM contacts
       WHERE id = $1 OR linked_id = $1`,
      [primaryContact.id]
    );

    const fullGroup = linked.concat(newContact ? [newContact] : []);

    await client.query('COMMIT');
    return formatResponse(fullGroup);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

// formats the unified response structure
function formatResponse(contacts) {
  const primary = contacts.find(c => c.link_precedence === 'primary') || contacts[0];

  const emails = [...new Set(contacts.map(c => c.email).filter(Boolean))];
  const phoneNumbers = [...new Set(contacts.map(c => c.phone_number).filter(Boolean))];
  const secondaryContactIds = [...new Set(
    contacts
      .filter(c => c.link_precedence === 'secondary')
      .map(c => c.id)
  )];

  return {
    contact: {
      primaryContactId: primary?.id ?? null,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  };
}

module.exports = {
  identifyContact,
};
