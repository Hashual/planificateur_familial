CREATE TABLE IF NOT EXISTS shoppingListArticle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shoppingListId INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    pictureUrl VARCHAR(255) NULL,
    dueDate TIMESTAMP NULL,
    completedAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shoppingListId) REFERENCES shoppingList (id) ON DELETE CASCADE
)