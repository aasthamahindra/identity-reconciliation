CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20),
  email VARCHAR(255),
  linked_id INTEGER REFERENCES contacts(id),
  link_precedence VARCHAR(20) CHECK (link_precedence IN ('primary', 'secondary')) NOT NULL DEFAULT 'primary',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_email ON contacts(email);
CREATE INDEX idx_phone ON contacts(phone_number);
