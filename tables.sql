CREATE TABLE users (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
);

DROP TABLE applications;
DROP TABLE vacancies;
DROP TABLE building_sell_orders;
DROP TABLE building_buy_orders;
DROP TABLE item_sell_orders;
DROP TABLE item_buy_orders;
DROP TABLE employment_contracts;
DROP TABLE character_buildings;
DROP TABLE character_items;
DROP TABLE character_job_experience;
DROP TABLE characters;
DROP TABLE buildings;
DROP TABLE jobs;
DROP TABLE luxuries;
DROP TABLE items;
DROP TABLE global_resource_stocks;
DROP TABLE global_resources;
DROP TABLE worlds;

CREATE TABLE worlds (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL,
	money_system ENUM('fixed_amount', 'loan_interest', 'growing_limits') NOT NULL,
	n_characters INT NOT NULL DEFAULT 1000,
	n_tiles INT NOT NULL DEFAULT 1000,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE global_resources (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE global_resource_stocks (
	world_id INT NOT NULL,
	global_resource_id INT NOT NULL,
	quantity INT NOT NULL,
	PRIMARY KEY (world_id, global_resource_id),
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (global_resource_id) REFERENCES global_resources(id)
);

CREATE TABLE items (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE luxuries (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	material_item_id INT NOT NULL,
	service_item_id INT NOT NULL,
	FOREIGN KEY (material_item_id) REFERENCES items(id),
	FOREIGN KEY (service_item_id) REFERENCES items(id)
);

CREATE TABLE jobs (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	input_item_id INT,
	global_input_id INT,
	booster_item_id INT,
	output_item_id INT,
	global_output_id INT,
	FOREIGN KEY (input_item_id) REFERENCES items(id),
	FOREIGN KEY (global_input_id) REFERENCES global_resources(id),
	FOREIGN KEY (booster_item_id) REFERENCES items(id),
	FOREIGN KEY (output_item_id) REFERENCES items(id),
	FOREIGN KEY (global_output_id) REFERENCES global_resources(id)
);

CREATE TABLE buildings (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	job_id INT,
	max_hours INT NOT NULL,
	FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE characters (
	id INT PRIMARY KEY AUTO_INCREMENT,
	first_name VARCHAR(32) NOT NULL,
	last_name VARCHAR(32) NOT NULL,
	world_id INT NOT NULL,
	user_id INT DEFAULT NULL,
	is_customized BOOLEAN NOT NULL DEFAULT FALSE,
	balance INT NOT NULL DEFAULT 0,
	age INT NOT NULL DEFAULT 18,
	hours_available INT NOT NULL DEFAULT 8,
	health INT NOT NULL DEFAULT 100,
	cumulative_health_loss INT NOT NULL DEFAULT 0,
	happiness INT NOT NULL DEFAULT 0,
	education_level INT NOT NULL DEFAULT 0,
	job_preference_1_id INT NOT NULL DEFAULT 1,
	job_preference_2_id INT NOT NULL DEFAULT 2,
	job_preference_3_id INT NOT NULL DEFAULT 3,
	luxury_preference_id INT NOT NULL DEFAULT 1,
	UNIQUE (world_id, user_id),
	UNIQUE (world_id, first_name, last_name),
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (job_preference_1_id) REFERENCES jobs(id),
	FOREIGN KEY (job_preference_2_id) REFERENCES jobs(id),
	FOREIGN KEY (job_preference_3_id) REFERENCES jobs(id),
	FOREIGN KEY (luxury_preference_id) REFERENCES luxuries(id)
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

CREATE TABLE employment_contracts (
	id INT PRIMARY KEY AUTO_INCREMENT,
	employer_id INT NOT NULL,
	employee_id INT NOT NULL,
	job_id INT NOT NULL,
	hours INT NOT NULL,
	hourly_wage INT NOT NULL,
	FOREIGN KEY (employer_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (employee_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (job_id) REFERENCES jobs(id)
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

INSERT INTO worlds (name, money_system) VALUES 
('Zo zuiver als goud', 'fixed_amount'),
('Belofte maakt schuld', 'loan_interest'),
('De tijd brengt raad', 'growing_limits');

INSERT INTO global_resources (name) VALUES
('Natuurlijke hulpbronnen'),       -- id = 1
('Zwerfvuil'),                     -- id = 2
('Infrastructuur');                -- id = 3

INSERT INTO global_resource_stocks (world_id, global_resource_id, quantity) VALUES
(1, 1, 100), -- Natuurlijke hulpbronnen
(1, 2, 0),   -- Zwerfvuil op straat
(1, 3, 100); -- Infrastructuur

INSERT INTO items (name) VALUES
('Voedsel'),                   -- id = 1
('Medische zorg'),             -- id = 2
('Onderwijs'),                 -- id = 3
('Procedures'),                -- id = 4
('Energie'),                   -- id = 5
('Informatie'),                -- id = 6
('Concert'),                   -- id = 7
('Videospel'),                 -- id = 8
('Modeshow'),                  -- id = 9
('Grondstoffen'),              -- id = 10
('Vuilnis'),                   -- id = 11
('Gereedschap'),               -- id = 12
('Machines'),                  -- id = 13
('Halffabricaten'),            -- id = 14
('Muziekinstrumenten'),        -- id = 15
('Elektronica'),               -- id = 16
('Kleding');                   -- id = 17

INSERT INTO luxuries (name, material_item_id, service_item_id) VALUES
('Muziek', 15, 7),    -- Muziekinstrumenten en Concert
('Games', 16, 8),     -- Elektronica en Videospel
('Mode', 17, 9);      -- Kleding en Modeshow

INSERT INTO jobs (name, input_item_id, global_input_id, booster_item_id, output_item_id, global_output_id) VALUES
('Landbouwer', NULL, NULL, 13, 1, NULL),                   -- x → Voedsel (Machines)
('Verpleegkundige', NULL, NULL, 12, 2, NULL),              -- x → Medische zorg (Gereedschap)
('Leraar', NULL, NULL, 6, 3, NULL),                        -- x → Onderwijs (Informatie)
('Kwaliteitsingenieur', NULL, NULL, 6, 4, NULL),           -- x → Procedures (Informatie)
('Windmolenoperator', NULL, NULL, 6, 5, NULL),             -- x → Energie (Informatie)
('Onderzoeker', NULL, NULL, 12, 6, NULL),                  -- x → Informatie (Gereedschap)
('Muzikant', NULL, NULL, 15, 7, NULL),                     -- x → Concert (Muziekinstrumenten)
('Spelontwikkelaar', NULL, NULL, 16, 8, NULL),             -- x → Videospel (Elektronica)
('Modeshoworganisator', NULL, NULL, 17, 9, NULL),          -- x → Modeshow (Kleding)
('Onderhoudsmedewerker', NULL, NULL, 4, NULL, 3),          -- x → Infrastructuur (Procedures)
('Mijnwerker', NULL, 1, 5, 10, NULL),                      -- Natuurlijke hulpbronnen → Grondstoffen (Energie)
('Recycler', 11, NULL, 5, 10, NULL),                       -- Vuilnis → Grondstoffen (Energie)
('Vuilnisophaler', NULL, 2, 13, 11, NULL),                 -- Zwerfvuil → Vuilnis (Machines)
('Gereedschapsfabrikant  ', 10, NULL, 5, 12, NULL),        -- Grondstoffen → Gereedschap (Energie)
('Machinebouwer', 10, NULL, 12, 13, NULL),                 -- Grondstoffen → Machines (Gereedschap)
('Procesoperator', 10, NULL, 13, 14, NULL),                -- Grondstoffen → Halffabricaten (Machines)
('Instrumentmaker', 14, NULL, 4, 15, NULL),                -- Halffabricaten → Muziekinstrumenten (Procedures)
('Elektronicaproducent', 14, NULL, 4, 16, NULL),           -- Halffabricaten → Elektronica (Procedures)
('Kledingproducent', 14, NULL, 4, 17, NULL);               -- Halffabricaten → Kleding (Procedures)
-- boswachter

INSERT INTO buildings (name, job_id, max_hours) VALUES
('Boerderij', 1, 100),
('Ziekenhuis', 2, 100),
('School', 3, 100),
('Kwaliteitslab', 4, 100),
('Windmolenpark', 5, 100),
('Onderzoekscentrum', 6, 100),
('Concertzaal', 7, 100),
('Spelstudio', 8, 100),
('Modezaal', 9, 100),
('Onderhoudsdepot', 10, 100),
('Mijn', 11, 100),
('Recyclagecentrum', 12, 100),
('Vuilniscentrale', 13, 100),
('Gereedschapsfabriek', 14, 100),
('Machinefabriek', 15, 100),
('Verwerkingsfabriek', 16, 100),
('Instrumentenatelier', 17, 100),
('Elektronicafabriek', 18, 100),
('Kledingfabriek', 19, 100);
-- magazijn
-- woonwijk/woning
-- natuurgebied

INSERT INTO characters (first_name, last_name, world_id) VALUES
('First 1', 'Last 1', 1),
('First 2', 'Last 2', 1),
('First 3', 'Last 3', 1),
('First 4', 'Last 4', 1),
('First 5', 'Last 5', 1),
('First 6', 'Last 6', 1),
('First 7', 'Last 7', 1),
('First 8', 'Last 8', 1),
('First 9', 'Last 9', 1),
('First 10', 'Last 10', 1),
('First 1', 'Last 1', 2),
('First 2', 'Last 2', 2),
('First 3', 'Last 3', 2),
('First 4', 'Last 4', 2),
('First 5', 'Last 5', 2),
('First 6', 'Last 6', 2),
('First 7', 'Last 7', 2),
('First 8', 'Last 8', 2),
('First 9', 'Last 9', 2),
('First 10', 'Last 10', 2),
('First 1', 'Last 1', 3),
('First 2', 'Last 2', 3),
('First 3', 'Last 3', 3),
('First 4', 'Last 4', 3),
('First 5', 'Last 5', 3),
('First 6', 'Last 5', 3),
('First 7', 'Last 5', 3),
('First 8', 'Last 5', 3),
('First 9', 'Last 5', 3),
('First 10', 'Last 5', 3);

INSERT INTO character_items (character_id, item_id, quantity) VALUES
(1, 1, 6),
(1, 4, 2),
(1, 6, 1),
(1, 10, 3),
(1, 16, 5);

INSERT INTO employment_contracts (employer_id, employee_id, job_id, hours, hourly_wage) VALUES
(2, 1, 1, 3, 500),
(5, 1, 4, 2, 400),
(7, 1, 8, 2, 250),
(10, 1, 8, 3, 350),
(1, 2, 3, 3, 200),
(4, 2, 5, 2, 400),
(9, 2, 9, 2, 350);






INSERT INTO characters (
  first_name, 
  last_name, 
  world_id, 
  user_id,
  is_customized,  
  balance, 
  age, 
  hours_available, 
  health, 
  cumulative_health_loss, 
  happiness, 
  education_level, 
  job_preference_1_id, 
  job_preference_2_id, 
  job_preference_3_id, 
  luxury_preference_id
) 
VALUES (
  'First 1', -- first_name
  'Last 1',  -- last_name
  1,         -- world_id
  NULL,      -- user_id
  false,     -- is_customized
  1000,      -- balance
  25,        -- age
  8,         -- hours_available
  100,       -- health
  0,         -- cumulative_health_loss
  0,         -- happiness
  2,         -- education_level 
  1,         -- job_preference_1_id
  2,         -- job_preference_2_id
  3,         -- job_preference_3_id
  1          -- luxury_preference_id
),(
  'First 2', -- first_name
  'Last 2',  -- last_name
  1,         -- world_id
  NULL,      -- user_id
  false,     -- is_customized
  1000,      -- balance
  30,        -- age
  8,         -- hours_available
  100,       -- health
  0,         -- cumulative_health_loss
  0,         -- happiness
  3,         -- education_level
  4,         -- job_preference_1_id
  5,         -- job_preference_2_id
  6,         -- job_preference_3_id
  2          -- luxury_preference_id
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