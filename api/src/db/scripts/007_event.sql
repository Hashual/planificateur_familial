CREATE TABLE IF NOT EXISTS event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    descritpion TEXT,
    startDate TIMESTAMP,
    endDate TIMESTAMP,
    isRecurrent BOOLEAN NOT NULL DEFAULT FALSE,
    color VARCHAR(255) NOT NULL
)