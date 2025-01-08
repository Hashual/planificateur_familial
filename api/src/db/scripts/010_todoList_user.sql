DROP PROCEDURE IF EXISTS todoList_user;

CREATE PROCEDURE todoList_user()
BEGIN
	IF NOT EXISTS (
		SELECT 1 
		FROM information_schema.columns 
		WHERE table_name='todoList' 
		AND column_name='userId'
	) THEN
		ALTER TABLE todoList ADD COLUMN userId INT NOT NULL AFTER title;
		ALTER TABLE todoList ADD CONSTRAINT fk_todoList_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE;
	END IF;
END;

CALL todoList_user();

DROP PROCEDURE todoList_user;