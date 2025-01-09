DROP PROCEDURE IF EXISTS todoList_owner;

CREATE PROCEDURE todoList_owner()
BEGIN
	IF NOT EXISTS (
		SELECT 1 
		FROM information_schema.columns 
		WHERE table_name='todoList' 
		AND column_name='ownerId'
	) THEN
		ALTER TABLE todoList ADD COLUMN ownerId INT NOT NULL AFTER title;
		ALTER TABLE todoList ADD CONSTRAINT fk_todoList_owner FOREIGN KEY (ownerId) REFERENCES user(id) ON DELETE CASCADE;
	END IF;
END;

CALL todoList_owner();

DROP PROCEDURE todoList_owner;