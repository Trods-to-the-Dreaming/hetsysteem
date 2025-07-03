CREATE TABLE users (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL
);

DROP TABLE applications;
DROP TABLE vacancies;
DROP TABLE building_transactions;
DROP TABLE building_sell_orders;
DROP TABLE building_buy_orders;
DROP TABLE product_transactions;
DROP TABLE product_sell_orders;
DROP TABLE product_buy_orders;
DROP TABLE employment_contracts;
DROP TABLE employer_boosts;
DROP TABLE character_job_experience;
DROP TABLE character_buildings;
DROP TABLE character_products;
DROP TABLE characters;
DROP TABLE jobs;
DROP TABLE buildings;
DROP TABLE recreations;
DROP TABLE global_resources;
DROP TABLE products;
DROP TABLE worlds;

CREATE TABLE worlds (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	money_system ENUM('fixed_amount', 'loan_interest', 'growing_limits') NOT NULL,
	n_characters INT NOT NULL,
	n_tiles INT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	volume INT NOT NULL
);

CREATE TABLE global_resources (
	world_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT NOT NULL,
	PRIMARY KEY (world_id, product_id),
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE recreations (
	id INT PRIMARY KEY AUTO_INCREMENT,
	product_id INT NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE buildings (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	n_tiles INT NOT NULL,
	max_working_hours INT NOT NULL
);

CREATE TABLE jobs (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(32) NOT NULL UNIQUE,
	building_id INT NOT NULL,
	input_id INT,
	output_id INT NOT NULL,
	booster_id INT NOT NULL,
	worn_booster_id INT,
	input_per_output INT,
	boosted_working_hours_per_booster INT NOT NULL,
	base_factor DECIMAL(3,2),
	boost_factor DECIMAL(3,1),
	FOREIGN KEY (building_id) REFERENCES buildings(id),
	FOREIGN KEY (input_id) REFERENCES products(id),
	FOREIGN KEY (output_id) REFERENCES products(id),
	FOREIGN KEY (booster_id) REFERENCES products(id),
	FOREIGN KEY (worn_booster_id) REFERENCES products(id)
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
	cumulative_health_gain INT NOT NULL DEFAULT 0,
	happiness INT NOT NULL DEFAULT 0,
	education INT NOT NULL DEFAULT 0,
	job_preference_1_id INT NOT NULL DEFAULT 1,
	job_preference_2_id INT NOT NULL DEFAULT 2,
	job_preference_3_id INT NOT NULL DEFAULT 3,
	recreation_preference_id INT NOT NULL DEFAULT 1,
	has_confirmed_trade BOOLEAN NOT NULL DEFAULT FALSE,
	UNIQUE (world_id, user_id),
	UNIQUE (world_id, first_name, last_name),
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (job_preference_1_id) REFERENCES jobs(id),
	FOREIGN KEY (job_preference_2_id) REFERENCES jobs(id),
	FOREIGN KEY (job_preference_3_id) REFERENCES jobs(id),
	FOREIGN KEY (recreation_preference_id) REFERENCES recreations(id)
);

CREATE TABLE character_products (
	character_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT NOT NULL DEFAULT 0,
	PRIMARY KEY (character_id, product_id),
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE character_buildings (
	character_id INT NOT NULL,
	building_id INT NOT NULL,
	quantity INT NOT NULL DEFAULT 0,
	PRIMARY KEY (character_id, building_id),
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE character_job_experience (
	character_id INT NOT NULL,
	job_id INT NOT NULL,
	experience INT NOT NULL DEFAULT 0,
	PRIMARY KEY (character_id, job_id),
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE employer_boosts (
	employer_id INT NOT NULL,
	job_id INT NOT NULL,
	boosted_working_hours INT NOT NULL DEFAULT 0,
	PRIMARY KEY (employer_id, job_id),
	FOREIGN KEY (employer_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (job_id) REFERENCES jobs(id)
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

CREATE TABLE product_buy_orders (
	character_id INT NOT NULL,
	product_id INT NOT NULL,
	demand INT NOT NULL,
	max_unit_price INT NOT NULL,
	PRIMARY KEY (character_id, product_id),
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE product_sell_orders (
	character_id INT NOT NULL,
	product_id INT NOT NULL,
	supply INT NOT NULL,
	min_unit_price INT NOT NULL,
	PRIMARY KEY (character_id, product_id),
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE product_transactions (
	buyer_id INT NOT NULL,
	seller_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT NOT NULL,
	price INT NOT NULL,
	PRIMARY KEY (buyer_id, seller_id, product_id),
	FOREIGN KEY (buyer_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (seller_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE building_buy_orders (
	character_id INT NOT NULL,
	building_id INT NOT NULL,
	demand INT NOT NULL,
	max_unit_price INT NOT NULL,
	PRIMARY KEY (character_id, building_id),
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE building_sell_orders (
	character_id INT NOT NULL,
	building_id INT NOT NULL,
	supply INT NOT NULL,
	min_unit_price INT NOT NULL,
	PRIMARY KEY (character_id, building_id),
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE building_transactions (
	buyer_id INT NOT NULL,
	seller_id INT NOT NULL,
	building_id INT NOT NULL,
	quantity INT NOT NULL,
	price INT NOT NULL,
	PRIMARY KEY (buyer_id, seller_id, building_id),
	FOREIGN KEY (buyer_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (seller_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE vacancies (
	character_id INT NOT NULL,
	building_id INT NOT NULL,
	hours INT NOT NULL,
	min_education INT NOT NULL,
	min_experience INT NOT NULL,
	max_hourly_wage INT NOT NULL,
	PRIMARY KEY (character_id, building_id, min_education, min_experience),
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

INSERT INTO worlds
(name,                   money_system,     n_characters, n_tiles) VALUES
('Zo zuiver als goud',   'fixed_amount',   3,            10),
('Belofte maakt schuld', 'loan_interest',  3,            10),
('De tijd brengt raad',  'growing_limits', 3,            10);

INSERT INTO products 
(name,                 volume) VALUES
('Voedsel',            1), -- id = 1
('Medische zorg',      1), -- id = 2
('Onderwijs',          1), -- id = 3
('Procedures',         1), -- id = 4
('Energie',            1), -- id = 5
('Informatie',         1), -- id = 6
('Concert',            1), -- id = 7
('Videospel',          1), -- id = 8
('Modeshow',           1), -- id = 9
('Infrastructuur',     1), -- id = 10
('Vuilnis',            1), -- id = 11
('Grondstoffen',       1), -- id = 12
('Gereedschap',        1), -- id = 13
('Machines',           1), -- id = 14
('Halffabricaten',     1), -- id = 15
('Muziekinstrumenten', 1), -- id = 16
('Elektronica',        1), -- id = 17
('Kleding',            1), -- id = 18
('Ertsen',             1), -- id = 19
('Zwerfvuil',          1); -- id = 20

INSERT INTO global_resources
(world_id, product_id, quantity) VALUES
(1,        10,         100), -- Infrastructuur
(1,        19,         100), -- Ertsen
(1,        20,           0), -- Zwerfvuil
(2,        10,         100), -- Infrastructuur
(2,        19,         100), -- Ertsen
(2,        20,           0), -- Zwerfvuil
(3,        10,         100), -- Infrastructuur
(3,        19,         100), -- Ertsen
(3,        20,           0); -- Zwerfvuil

INSERT INTO recreations
(product_id) VALUES
(7), -- Concert
(8), -- Videospel
(9); -- Modeshow

INSERT INTO buildings
(name,                  n_tiles, max_working_hours) VALUES
('Boerderij',           1,       40), -- id = 1
('Ziekenhuis',          1,       40), -- id = 2
('School',              1,       40), -- id = 3
('Kwaliteitslab',       1,       40), -- id = 4
('Windmolenpark',       1,       40), -- id = 5
('Onderzoekscentrum',   1,       40), -- id = 6
('Concertzaal',         1,       40), -- id = 7
('Spelstudio',          1,       40), -- id = 8
('Modezaal',            1,       40), -- id = 9
('Onderhoudsdepot',     1,       40), -- id = 10
('Vuilniscentrale',     1,       40), -- id = 11
('Mijn',                1,       40), -- id = 12
('Gereedschapsfabriek', 1,       40), -- id = 13
('Machinefabriek',      1,       40), -- id = 14
('Verwerkingsfabriek',  1,       40), -- id = 15
('Instrumentenatelier', 1,       40), -- id = 16
('Elektronicafabriek',  1,       40), -- id = 17
('Kledingfabriek',      1,       40), -- id = 18
('Recyclagecentrum',    1,       40), -- id = 19
('Woning',              1,       40), -- id = 20
('Magazijn',            1,       40); -- id = 21

INSERT INTO jobs
(name,                    building_id, input_id, output_id, booster_id, worn_booster_id, input_per_output, boosted_working_hours_per_booster, base_factor, boost_factor) VALUES
('Landbouwer',             1,          NULL,      1,        14,         20,              NULL,             5,                                 0.80,         4), -- x → Voedsel (Machines)
('Verpleegkundige',        2,          NULL,      2,        13,         20,              NULL,             5,                                 5.00,         4), -- x → Medische zorg (Gereedschap)
('Leraar',                 3,          NULL,      3,         6,         NULL,            NULL,             5,                                 1,            4), -- x → Onderwijs (Informatie)
('Kwaliteitsingenieur',    4,          NULL,      4,         6,         NULL,            NULL,             5,                                 1,            4), -- x → Procedures (Informatie)
('Windmolenoperator',      5,          NULL,      5,         6,         NULL,            NULL,             5,                                 1,            4), -- x → Energie (Informatie)
('Onderzoeker',            6,          NULL,      6,        13,         20,              NULL,             5,                                 1,            4), -- x → Informatie (Gereedschap)
('Muzikant',               7,          NULL,      7,        16,         20,              NULL,             5,                                 1,            4), -- x → Concert (Muziekinstrumenten)
('Spelontwikkelaar',       8,          NULL,      8,        17,         20,              NULL,             5,                                 1,            4), -- x → Videospel (Elektronica)
('Modeshoworganisator',    9,          NULL,      9,        18,         20,              NULL,             5,                                 1,            4), -- x → Modeshow (Kleding)
('Onderhoudsmedewerker',  10,          12,       10,         4,         NULL,            1,                5,                                 1,            4), -- x → Infrastructuur (Procedures)
('Vuilnisophaler',        11,          20,       11,        14,         20,              1,                5,                                 1,            4), -- Zwerfvuil → Vuilnis (Machines)
('Mijnwerker',            12,          19,       12,         5,         NULL,            1,                5,                                 1,            4), -- Ertsen → Grondstoffen (Energie)
('Gereedschapsfabrikant', 13,          12,       13,         5,         NULL,            1,                5,                                 1,            4), -- Grondstoffen → Gereedschap (Energie)
('Machinebouwer',         14,          12,       14,        13,         20,              1,                5,                                 1,            4), -- Grondstoffen → Machines (Gereedschap)
('Procesoperator',        15,          12,       15,        14,         20,              1,                5,                                 1,            4), -- Grondstoffen → Halffabricaten (Machines)
('Instrumentmaker',       16,          15,       16,         4,         NULL,            1,                5,                                 1,            4), -- Halffabricaten → Muziekinstrumenten (Procedures)
('Elektronicaproducent',  17,          15,       17,         4,         NULL,            1,                5,                                 1,            4), -- Halffabricaten → Elektronica (Procedures)
('Kledingproducent',      18,          15,       18,         4,         NULL,            1,                5,                                 1,            4), -- Halffabricaten → Kleding (Procedures)
('Recycler',              19,          11,       12,         5,         NULL,            1,                5,                                 1,            4); -- Vuilnis → Grondstoffen (Energie)

INSERT INTO characters
(first_name,   last_name,      world_id) VALUES
('Voornaam 1', 'Achternaam 1', 1),
('Voornaam 2', 'Achternaam 2', 1),
('Voornaam 3', 'Achternaam 3', 1),
/*('Voornaam 4', 'Achternaam 4', 1),
('Voornaam 5', 'Achternaam 5', 1),
('Voornaam 6', 'Achternaam 6', 1),
('Voornaam 7', 'Achternaam 7', 1),
('Voornaam 8', 'Achternaam 8', 1),
('Voornaam 9', 'Achternaam 9', 1),
('Voornaam 10', 'Achternaam 10', 1),*/
('Voornaam 1', 'Achternaam 1', 2),
('Voornaam 2', 'Achternaam 2', 2),
('Voornaam 3', 'Achternaam 3', 2),
/*('Voornaam 4', 'Achternaam 4', 2),
('Voornaam 5', 'Achternaam 5', 2),
('Voornaam 6', 'Achternaam 6', 2),
('Voornaam 7', 'Achternaam 7', 2),
('Voornaam 8', 'Achternaam 8', 2),
('Voornaam 9', 'Achternaam 9', 2),
('Voornaam 10', 'Achternaam 10', 2),*/
('Voornaam 1', 'Achternaam 1', 3),
('Voornaam 2', 'Achternaam 2', 3),
('Voornaam 3', 'Achternaam 3', 3);
/*('Voornaam 4', 'Achternaam 4', 3),
('Voornaam 5', 'Achternaam 5', 3),
('Voornaam 6', 'Achternaam 5', 3),
('Voornaam 7', 'Achternaam 5', 3),
('Voornaam 8', 'Achternaam 5', 3),
('Voornaam 9', 'Achternaam 5', 3),
('Voornaam 10', 'Achternaam 5', 3);*/

INSERT INTO character_products
(character_id, product_id, quantity) VALUES
(1,              1,        6),
(1,              4,        2),
(2,              6,        1),
(2,             10,        3),
(3,             16,        5);

INSERT INTO employment_contracts
(employer_id, employee_id, job_id, hours, hourly_wage) VALUES
(2,           1,           1,      3,     500),
(3,           1,           4,      2,     400);


/*Dus het gecombineerde effect van boost, ervaring en opleiding moet x30 zijn.

Dat is realistisch verdeeld als:

Factor	Waarde	Toelichting
BF_landbouwer	3–5	Machines geven een boost van 3 tot 5× productiviteit (denk: handarbeid → tractor)
EF_landbouwer	1–2.5	Door ervaring – exponentieel stijgend met afvlakking
OF (opleiding)	2–3	Opleiding verhoogt output aanzienlijk

Bijvoorbeeld: BF = 3.5, EF = 2.0, OF = 4.3 ⇒ 3.5 × 2.0 × 4.3 ≈ 30.1*/

/*SELECT * FROM item_buy_orders
WHERE item_id = ?
ORDER BY max_price_per_unit DESC;

SELECT * FROM item_sell_orders
WHERE item_id = ?
ORDER BY min_price_per_unit ASC;

CREATE INDEX idx_buy_orders_price ON item_buy_orders(item_id, max_price_per_unit DESC);
CREATE INDEX idx_sell_orders_price ON item_sell_orders(item_id, min_price_per_unit ASC);

In the matching algorithm, the payable demand must be used. For example, if character A wants to buy 10 instances of item X at a maximum */