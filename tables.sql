CREATE TABLE users (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
);

CREATE TABLE games (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL,
	--money_system ENUM('fixed_amount', 'loan_interest', 'growing_limits') NOT NULL,
	--max_players INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE characters (
	id INT PRIMARY KEY AUTO_INCREMENT,
	first_name VARCHAR(32) NOT NULL,
	last_name VARCHAR(32) NOT NULL,
	game_id INT NOT NULL,
	user_id INT NOT NULL,
	balance INT NOT NULL,
	age INT NOT NULL,
	hours_available INT NOT NULL,
	health INT NOT NULL DEFAULT 100,
	cumulative_health_loss INT NOT NULL,
	happiness INT NOT NULL,
	education_level INT NOT NULL,
	job_preference_1_id INT NOT NULL,
	job_preference_2_id INT NOT NULL,
	job_preference_3_id INT NOT NULL,
	luxury_preference_id INT NOT NULL,
	UNIQUE (game_id, first_name, last_name),
	FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
	FOREIGN KEY (job_preference_1_id) REFERENCES jobs(id),
	FOREIGN KEY (job_preference_2_id) REFERENCES jobs(id),
	FOREIGN KEY (job_preference_3_id) REFERENCES jobs(id),
	FOREIGN KEY (luxury_preference_id) REFERENCES luxury_preferences(id)
);

CREATE TABLE buildings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL UNIQUE,
    job_id INT,
	max_hours INT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE items (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL UNIQUE,
    input_item_id INT,
    booster_item_id INT NOT NULL,
    output_item_id INT NOT NULL,
    FOREIGN KEY (input_item_id) REFERENCES items(id),
    FOREIGN KEY (booster_item_id) REFERENCES items(id),
    FOREIGN KEY (output_item_id) REFERENCES items(id)
);

CREATE TABLE luxury_preferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL UNIQUE,
    material_item_id INT NOT NULL,
    service_item_id INT NOT NULL,
    FOREIGN KEY (material_item_id) REFERENCES items(id),
    FOREIGN KEY (service_item_id) REFERENCES items(id)
);

CREATE TABLE character_job_experience (
    character_id INT NOT NULL,
    job_id INT NOT NULL,
    experience INT NOT NULL DEFAULT 0,
    PRIMARY KEY (character_id, job_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE character_items (
    character_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    PRIMARY KEY (character_id, item_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE character_buildings (
	character_id INT NOT NULL,
    building_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    PRIMARY KEY (character_id, building_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE item_buy_orders (
    character_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    max_price_per_unit INT NOT NULL,
	PRIMARY KEY (character_id, item_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE item_sell_orders (
    character_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    min_price_per_unit INT NOT NULL,
	PRIMARY KEY (character_id, item_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id)
);

CREATE TABLE building_buy_orders (
    character_id INT NOT NULL,
    building_id INT NOT NULL,
    quantity INT NOT NULL,
    max_price_per_unit INT NOT NULL,
	PRIMARY KEY (character_id, building_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE building_sell_orders (
    character_id INT NOT NULL,
    building_id INT NOT NULL,
    quantity INT NOT NULL,
    min_price_per_unit INT NOT NULL,
	PRIMARY KEY (character_id, building_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE vacancies (
    character_id INT NOT NULL,
	building_id INT NOT NULL,
    hours INT NOT NULL,
	min_education_experience INT NOT NULL,
    max_hourly_wage INT NOT NULL,
	PRIMARY KEY (character_id, building_id, min_education_experience),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE applications (
    character_id INT NOT NULL,
    building_id INT NOT NULL,
    hours INT NOT NULL,
    min_hourly_wage INT NOT NULL,
	PRIMARY KEY (character_id, building_id),
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (building_id) REFERENCES buildings(id)
);




SELECT * FROM item_buy_orders
WHERE item_id = ?
ORDER BY max_price_per_unit DESC;

SELECT * FROM item_sell_orders
WHERE item_id = ?
ORDER BY min_price_per_unit ASC;

CREATE INDEX idx_buy_orders_price ON item_buy_orders(item_id, max_price_per_unit DESC);
CREATE INDEX idx_sell_orders_price ON item_sell_orders(item_id, min_price_per_unit ASC);

In the matching algorithm, the payable demand must be used. For example, if character A wants to buy 10 instances of item X at a maximum 