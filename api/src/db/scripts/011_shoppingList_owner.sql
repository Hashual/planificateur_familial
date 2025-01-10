DROP PROCEDURE IF EXISTS todoList_owner;

CREATE PROCEDURE shoppingList_owner()
BEGIN
	IF NOT EXISTS (
		SELECT 1 
		FROM information_schema.columns 
		WHERE table_name='shoppingList'
		AND column_name='ownerId'
	) THEN
		ALTER TABLE shoppingList ADD COLUMN ownerId INT NOT NULL AFTER title;
		ALTER TABLE shoppingList ADD CONSTRAINT fk_shoppingList_owner FOREIGN KEY (ownerId) REFERENCES user(id) ON DELETE CASCADE;
	END IF;
END;

CALL shoppingList_owner();

DROP PROCEDURE shoppingList_owner;