/*Nog te doen op Combell:
ALTER TABLE `hetsysteem`.`characters` 
CHANGE COLUMN `has_confirmed_consumption` `has_confirmed_survive` TINYINT(1) NOT NULL DEFAULT '0' ,
CHANGE COLUMN `has_confirmed_orders` `has_confirmed_trade` TINYINT(1) NOT NULL DEFAULT '0' ,
CHANGE COLUMN `has_confirmed_hours` `has_confirmed_spend_time` TINYINT(1) NOT NULL DEFAULT '0' ;
*/

// Nog te doen op beide: job_contracts koppelen aan gebouw?

// Dagelijkse invoer:
// 1/ overleven: 
//		invoeren in action_survive
// 2/ handel drijven: 
//		invoeren in action_buy_product, action_sell_product, action_buy_building en action_sell_building
// 3/ tijd besteden:
//		beperkt door characters (hours_available) en door contracts, courses en recreation
//		invoeren in action_work, action_learn en action_relax
// 4/ contracten beheren:
//		ontslag nemen en ontslaan beperkt door contracts
//		invoeren in action_apply, action_recruit, action_resign, action_dismiss
// 5/ gebouwen beheren:
//		invoeren in action_build, action_boost
// 6/ giften:
//		geld of producten
//		updaten in characters (balance) en character_products

// Nachtelijke verwerking:
// 1/ produceren:
//		uitvoeren op basis van action_work en characters (balance)
//		beïnvloed door characters (education), character_job_experience, employer_boosts, global_resources (litter)
//		updaten in characters (balance) en character_products
//		bijhouden hoeveel zwerfvuil wordt geproduceerd en pas op einde updaten
// 2/ consumeren:
//		uitvoeren op basis van action_survive, action_learn en action_relax


// 1/ consumptie van voedsel en medische zorg:
//		op basis van action_survive
//		verwijderen uit character_products
//		updaten characters
// 2/ consumptie van opleiding en ontspanning:
//		op basis van action_learn en action_relax
//		verwijderen uit courses en recreation (hoe dan ook)
//		updaten characters
// 3/ handel:
//		op basis van action_buy_product, action_sell_product, action_buy_building en action_sell_building
//		verwijderen uit character_products (education, concert, video-game en fashion-show)
//		toevoegen aan action_learn en action_relax
//		updaten character_products en character_buildings
// 4/ tijd besteden:
// 5/ contracten sluiten:
// 6/ bederfbare producten, opleidingen en activiteiten verwijderen.


// Geproduceerde opleidingen en activiteiten komen in character_products terecht. Daarin wordt gekeken bij het verkopen.
// Aangekochte opleidingen en activiteiten komen in courses en activities terecht (met leraar of organisator, op basis van seller_id). Daarin wordt gekeken bij het tijd besteden.




//		aankoop invoeren in character_products en character_buildings (behalve education in character_education, en concert, video-game en fashion-show in character_recreation)






CREATE TABLE users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
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
DROP TABLE character_consumption;
DROP TABLE character_buildings;
DROP TABLE character_products;
DROP TABLE characters;
DROP TABLE jobs;
DROP TABLE buildings;
DROP TABLE recreations;
DROP TABLE global_resources;
DROP TABLE products;
DROP TABLE worlds;

DROP TABLE employment_contracts;
DROP TABLE character_experience;
DROP TABLE character_buildings;
DROP TABLE character_products;
DROP TABLE characters;
DROP TABLE buildings;
DROP TABLE recreations;
DROP TABLE world_resources;
DROP TABLE products;
DROP TABLE worlds;





DROP TABLE residences;
DROP TABLE rental_agreements;
DROP TABLE employment_contracts;
DROP TABLE character_experience;
DROP TABLE character_buildings;
DROP TABLE character_products;
DROP TABLE characters;
DROP TABLE buildings;
DROP TABLE recreations;
DROP TABLE world_resources;
DROP TABLE products;
DROP TABLE world_state;
DROP TABLE worlds;




CREATE TABLE worlds (
	id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	slug VARCHAR(32) NOT NULL UNIQUE,
	type VARCHAR(32) NOT NULL UNIQUE,
	money_system ENUM('fixed_amount', 'loan_interest', 'growing_limits') NOT NULL,
	n_characters INT UNSIGNED NOT NULL,
	n_tiles INT UNSIGNED NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE world_state (
	world_id TINYINT UNSIGNED PRIMARY KEY,
	current_turn SMALLINT UNSIGNED NOT NULL DEFAULT 1,
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE
);

CREATE TABLE products (
	id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	slug VARCHAR(32) NOT NULL UNIQUE,
	type VARCHAR(32) NOT NULL UNIQUE,
	volume TINYINT UNSIGNED NOT NULL DEFAULT 1
);

CREATE TABLE world_resources (
	world_id TINYINT UNSIGNED NOT NULL,
	product_id TINYINT UNSIGNED NOT NULL,
	quantity INT UNSIGNED NOT NULL,
	PRIMARY KEY (world_id, product_id),
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE recreations (
	id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	product_id TINYINT UNSIGNED NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE buildings (
	id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	slug VARCHAR(32) NOT NULL UNIQUE,
	type VARCHAR(32) NOT NULL,
	tile_size TINYINT UNSIGNED NOT NULL,
	job VARCHAR(32) NOT NULL UNIQUE,
	input_id TINYINT UNSIGNED,
	output_id TINYINT UNSIGNED NOT NULL,
	booster_id TINYINT UNSIGNED NOT NULL,
	worn_booster_id TINYINT UNSIGNED,
	input_per_output TINYINT UNSIGNED,
	boosted_working_hours_per_booster TINYINT UNSIGNED NOT NULL,
	max_working_hours TINYINT UNSIGNED NOT NULL,
	base_factor DECIMAL(3,2),
	boost_factor DECIMAL(3,1),
	FOREIGN KEY (input_id) REFERENCES products(id),
	FOREIGN KEY (output_id) REFERENCES products(id),
	FOREIGN KEY (booster_id) REFERENCES products(id),
	FOREIGN KEY (worn_booster_id) REFERENCES products(id)
);

CREATE TABLE characters (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	world_id TINYINT UNSIGNED NOT NULL,
	user_id INT UNSIGNED DEFAULT NULL,
	first_name VARCHAR(32) DEFAULT NULL,
	last_name VARCHAR(32) DEFAULT NULL,
	job_preference_1_id TINYINT UNSIGNED DEFAULT NULL,
	job_preference_2_id TINYINT UNSIGNED DEFAULT NULL,
	job_preference_3_id TINYINT UNSIGNED DEFAULT NULL,
	recreation_preference_id TINYINT UNSIGNED DEFAULT NULL,
	is_customized BOOLEAN NOT NULL DEFAULT FALSE,
	birth_date SMALLINT UNSIGNED NOT NULL DEFAULT 1,
	health TINYINT UNSIGNED NOT NULL DEFAULT 100,
	life_expectancy TINYINT UNSIGNED NOT NULL DEFAULT 0,
	happiness SMALLINT UNSIGNED NOT NULL DEFAULT 0,
	education SMALLINT UNSIGNED NOT NULL DEFAULT 0,
	balance INT NOT NULL DEFAULT 0,
	owned_tiles INT UNSIGNED NOT NULL DEFAULT 0,
	hours_available TINYINT UNSIGNED NOT NULL DEFAULT 13,
	food_consumed TINYINT UNSIGNED NOT NULL DEFAULT 0,
	medical_care_consumed TINYINT UNSIGNED NOT NULL DEFAULT 0,
	UNIQUE (world_id, user_id),
	UNIQUE (world_id, first_name, last_name),
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (job_preference_1_id) REFERENCES buildings(id),
	FOREIGN KEY (job_preference_2_id) REFERENCES buildings(id),
	FOREIGN KEY (job_preference_3_id) REFERENCES buildings(id),
	FOREIGN KEY (recreation_preference_id) REFERENCES recreations(id)
);

CREATE TABLE character_products (
	owner_id INT UNSIGNED NOT NULL,
	product_id TINYINT UNSIGNED NOT NULL,
	quantity INT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (owner_id, product_id),
	FOREIGN KEY (owner_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE character_buildings (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	world_id TINYINT UNSIGNED NOT NULL, -- for name uniqueness
	owner_id INT UNSIGNED NOT NULL,
	building_id TINYINT UNSIGNED NOT NULL,
	name VARCHAR(32) NOT NULL,
	size TINYINT UNSIGNED NOT NULL DEFAULT 1,
	boosted_working_hours SMALLINT UNSIGNED NOT NULL DEFAULT 0,
	UNIQUE (world_id, name),
	FOREIGN KEY (world_id) REFERENCES worlds(id) ON DELETE CASCADE,
	FOREIGN KEY (owner_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

CREATE TABLE character_experience (
	character_id INT UNSIGNED NOT NULL,
	job_id TINYINT UNSIGNED NOT NULL,
	experience SMALLINT UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (character_id, job_id),
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (job_id) REFERENCES buildings(id)
);

CREATE TABLE employment_contracts (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	employee_id INT UNSIGNED NOT NULL,
	workplace_id INT UNSIGNED NOT NULL,
	working_hours TINYINT UNSIGNED NOT NULL,
	hourly_wage INT UNSIGNED NOT NULL,
	FOREIGN KEY (employee_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (workplace_id) REFERENCES character_buildings(id)
);

CREATE TABLE rental_agreements (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	tenant_id INT UNSIGNED NOT NULL,
	residence_id INT UNSIGNED NOT NULL,
	daily_rent INT UNSIGNED NOT NULL,
	FOREIGN KEY (tenant_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (residence_id) REFERENCES character_buildings(id)
);

CREATE TABLE action_customize (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	character_id INT UNSIGNED NOT NULL,
	first_name VARCHAR(32) NOT NULL,
	last_name VARCHAR(32) NOT NULL,
	job_preference_1_id TINYINT UNSIGNED NOT NULL,
	job_preference_2_id TINYINT UNSIGNED NOT NULL,
	job_preference_3_id TINYINT UNSIGNED NOT NULL,
	recreation_preference_id TINYINT UNSIGNED NOT NULL,
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (job_preference_1_id) REFERENCES buildings(id),
	FOREIGN KEY (job_preference_2_id) REFERENCES buildings(id),
	FOREIGN KEY (job_preference_3_id) REFERENCES buildings(id),
	FOREIGN KEY (recreation_preference_id) REFERENCES recreations(id)
);

CREATE TABLE action_demolish (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	building_id INT UNSIGNED NOT NULL,
	FOREIGN KEY (building_id) REFERENCES character_buildings(id)
);

CREATE TABLE action_construct (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	owner_id INT UNSIGNED NOT NULL,
	building_id TINYINT UNSIGNED NOT NULL,
	name VARCHAR(32) NOT NULL,
	size TINYINT UNSIGNED NOT NULL,
	FOREIGN KEY (owner_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (building_id) REFERENCES buildings(id)
);

INSERT INTO worlds
(type,                   slug,   money_system,     n_characters, n_tiles) VALUES
('Zo zuiver als goud',   'gold', 'fixed_amount',   3,            10),
('Belofte maakt schuld', 'debt', 'loan_interest',  3,            10),
('De tijd brengt raad',  'time', 'growing_limits', 3,            10);

INSERT INTO world_state
(world_id) VALUES
(1),
(2),
(3);

INSERT INTO products 
(slug,               type,                 volume) VALUES
('food',             'Voedsel',            1), -- id = 1
('medical-care',     'Medische zorg',      1), -- id = 2
('domestic-help',    'Huishoudhulp',       1), -- id = 3
('education',        'Onderwijs',          1), -- id = 4
('order-processing', 'Orderverwerking',    1), -- id = 5
('procedures',       'Procedures',         1), -- id = 6
('energy',           'Energie',            1), -- id = 7
('information',      'Informatie',         1), -- id = 8
('concert',          'Concert',            1), -- id = 9
('video-game',       'Videospel',          1), -- id = 10
('fashion-show',     'Modeshow',           1), -- id = 11
('infrastructure',   'Infrastructuur',     1), -- id = 12
('trash',            'Vuilnis',            1), -- id = 13
('raw-materials',    'Grondstoffen',       1), -- id = 14
('tools',            'Gereedschap',        1), -- id = 15
('machines',         'Machines',           1), -- id = 16
('intermediates',    'Halffabricaten',     1), -- id = 17
('instruments',      'Muziekinstrumenten', 1), -- id = 18
('electronics',      'Elektronica',        1), -- id = 19
('clothing',         'Kleding',            1), -- id = 20
('ores',             'Ertsen',             1), -- id = 21
('litter',           'Zwerfvuil',          1); -- id = 22

INSERT INTO world_resources
(world_id, product_id, quantity) VALUES
(1,        12,         100), -- Infrastructuur
(1,        21,         100), -- Ertsen
(1,        22,           0), -- Zwerfvuil
(2,        12,         100), -- Infrastructuur
(2,        21,         100), -- Ertsen
(2,        22,           0), -- Zwerfvuil
(3,        12,         100), -- Infrastructuur
(3,        21,         100), -- Ertsen
(3,        22,           0); -- Zwerfvuil

INSERT INTO recreations
(product_id) VALUES
(9),  -- Concert
(10), -- Videospel
(11); -- Modeshow

INSERT INTO buildings
(slug,                  type,                  tile_size, job,                     input_id, output_id, booster_id, worn_booster_id, input_per_output, boosted_working_hours_per_booster, max_working_hours, base_factor,  boost_factor) VALUES
('farm',                'Boerderij',           1,         'Landbouwer',            NULL,      1,        16,         22,              NULL,             5,                                 40,                0.80,         4), -- x → Voedsel (Machines)
('hospital',            'Ziekenhuis',          1,         'Verpleegkundige',       NULL,      2,        15,         22,              NULL,             5,                                 40,                5.00,         4), -- x → Medische zorg (Gereedschap)
('house',               'Woning',              1,         'Schoonmaker',           NULL,      3,        15,         NULL,            NULL,             5,                                 40,                1,            4), -- x → Huishoudhulp (Gereedschap)
('school',              'School',              1,         'Leraar',                NULL,      4,         8,         NULL,            NULL,             5,                                 40,                1,            4), -- x → Onderwijs (Informatie)
('warehouse',           'Magazijn',            1,         'Logistiek medewerker',  NULL,      5,        16,         22,              NULL,             5,                                 40,                1,            4), -- x → Orderverwerking (Machines)
('quality-lab',         'Kwaliteitslab',       1,         'Kwaliteitsingenieur',   NULL,      6,         8,         NULL,            NULL,             5,                                 40,                1,            4), -- x → Procedures (Informatie)
('wind-park',           'Windmolenpark',       1,         'Windmolenoperator',     NULL,      7,         8,         NULL,            NULL,             5,                                 40,                1,            4), -- x → Energie (Informatie)
('research-center',     'Onderzoekscentrum',   1,         'Onderzoeker',           NULL,      8,        15,         22,              NULL,             5,                                 40,                1,            4), -- x → Informatie (Gereedschap)
('concert-hall',        'Concertzaal',         1,         'Muzikant',              NULL,      9,        18,         22,              NULL,             5,                                 40,                1,            4), -- x → Concert (Muziekinstrumenten)
('game-studio',         'Spelstudio',          1,         'Spelontwikkelaar',      NULL,     10,        19,         22,              NULL,             5,                                 40,                1,            4), -- x → Videospel (Elektronica)
('fashion-hall',        'Modezaal',            1,         'Modeshoworganisator',   NULL,     11,        20,         22,              NULL,             5,                                 40,                1,            4), -- x → Modeshow (Kleding)
('maintenance-depot',   'Onderhoudsdepot',     1,         'Onderhoudsmedewerker',  14,       12,         6,         NULL,            1,                5,                                 40,                1,            4), -- x → Infrastructuur (Procedures)
('waste-center',        'Vuilniscentrale',     1,         'Vuilnisophaler',        22,       13,        16,         22,              1,                5,                                 40,                1,            4), -- Zwerfvuil → Vuilnis (Machines)
('mine',                'Mijn',                1,         'Mijnwerker',            21,       14,         7,         NULL,            1,                5,                                 40,                1,            4), -- Ertsen → Grondstoffen (Energie)
('tool-factory',        'Gereedschapsfabriek', 1,         'Gereedschapsfabrikant', 14,       15,         7,         NULL,            1,                5,                                 40,                1,            4), -- Grondstoffen → Gereedschap (Energie)
('machine-factory',     'Machinefabriek',      1,         'Machinebouwer',         14,       16,        15,         22,              1,                5,                                 40,                1,            4), -- Grondstoffen → Machines (Gereedschap)
('processing-plant',    'Verwerkingsfabriek',  1,         'Procesoperator',        14,       17,        16,         22,              1,                5,                                 40,                1,            4), -- Grondstoffen → Halffabricaten (Machines)
('instrument-workshop', 'Instrumentenatelier', 1,         'Instrumentmaker',       17,       18,         6,         NULL,            1,                5,                                 40,                1,            4), -- Halffabricaten → Muziekinstrumenten (Procedures)
('electronics-factory', 'Elektronicafabriek',  1,         'Elektronicaproducent',  17,       19,         6,         NULL,            1,                5,                                 40,                1,            4), -- Halffabricaten → Elektronica (Procedures)
('clothing-factory',    'Kledingfabriek',      1,         'Kledingproducent',      17,       20,         6,         NULL,            1,                5,                                 40,                1,            4), -- Halffabricaten → Kleding (Procedures)
('recycling-center',    'Recyclagecentrum',    1,         'Recycler',              13,       14,         7,         NULL,            1,                5,                                 40,                1,            4); -- Vuilnis → Grondstoffen (Energie)

INSERT INTO characters
(world_id) VALUES
(1),
(1),
(1),
(2),
(2),
(2),
(3),
(3),
(3);

INSERT INTO character_products
(owner_id, product_id, quantity) VALUES
(1,             1,         6),
(1,             6,         2),
(2,             8,         1),
(2,            12,         3),
(3,            18,         5);

INSERT INTO character_buildings
(world_id, owner_id, building_id, name,                 size, boosted_working_hours) VALUES
(1,        1,         1,          'De Appelgaard',      1,    0),
(1,        1,         6,          'Kwaliteitskompas',   1,    0),
(1,        1,         8,          'Innovatiehub',       1,    0),
(1,        2,        12,          'Mobipark',           1,    0),
(1,        2,        18,          'De Stemmige Snaren', 1,    0);






CREATE TABLE residences (
	character_id INT UNSIGNED PRIMARY KEY,
	residence_id INT UNSIGNED,
	FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (residence_id) REFERENCES character_buildings(id) ON DELETE SET NULL
);




CREATE TABLE courses (
	id INT PRIMARY KEY AUTO_INCREMENT,
	teacher_id INT NOT NULL,
	student_id INT NOT NULL,
	hours INT NOT NULL,
	FOREIGN KEY (teacher_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (student_id) REFERENCES characters(id) ON DELETE CASCADE,
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



CREATE TABLE job_hours (
	employee_id INT NOT NULL,
	contract_id INT NOT NULL,
	hours INT NOT NULL,
	PRIMARY KEY (employee_id, contract_id),
	FOREIGN KEY (employee_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (contract_id) REFERENCES job_contracts(id)
);

CREATE TABLE course_hours (
	student_id INT NOT NULL,
	course_id INT NOT NULL,
	hours INT NOT NULL,
	PRIMARY KEY (student_id, contract_id),
	FOREIGN KEY (student_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE activity_hours (
	participant_id INT NOT NULL,
	activity_id INT NOT NULL,
	hours INT NOT NULL,
	PRIMARY KEY (participant_id, contract_id),
	FOREIGN KEY (participant_id) REFERENCES characters(id) ON DELETE CASCADE,
	FOREIGN KEY (activity_id) REFERENCES activities(id)
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








INSERT INTO contracts
(employee_id, workplace_id, working_hours, hourly_wage) VALUES
(1,           1,            3,             500),
(1,           2,            2,             400);






INSERT INTO jobs
(slug,                     type,                    input_id, output_id, booster_id, worn_booster_id, input_per_output, boosted_working_hours_per_booster, max_working_hours, base_factor,  boost_factor) VALUES
('farmer',                 'Landbouwer',            NULL,      1,        16,         22,              NULL,             5,                                 40,                0.80,         4), -- x → Voedsel (Machines)
('nurse',                  'Verpleegkundige',       NULL,      2,        15,         22,              NULL,             5,                                 40,                5.00,         4), -- x → Medische zorg (Gereedschap)
('cleaner',                'Schoonmaker',           NULL,      3,        15,         NULL,            NULL,             5,                                 40,                1,            4), -- x → Huishoudhulp (Gereedschap)
('teacher',                'Leraar',                NULL,      4,         8,         NULL,            NULL,             5,                                 40,                1,            4), -- x → Onderwijs (Informatie)
('logistics-worker',       'Logistiek medewerker',  NULL,      5,        16,         22,              NULL,             5,                                 40,                1,            4), -- x → Orderverwerking (Machines)
('quality-engineer',       'Kwaliteitsingenieur',   NULL,      6,         8,         NULL,            NULL,             5,                                 40,                1,            4), -- x → Procedures (Informatie)
('wind-turbine-operator',  'Windmolenoperator',     NULL,      7,         8,         NULL,            NULL,             5,                                 40,                1,            4), -- x → Energie (Informatie)
('researcher',             'Onderzoeker',           NULL,      8,        15,         22,              NULL,             5,                                 40,                1,            4), -- x → Informatie (Gereedschap)
('musician',               'Muzikant',              NULL,      9,        18,         22,              NULL,             5,                                 40,                1,            4), -- x → Concert (Muziekinstrumenten)
('game-developer',         'Spelontwikkelaar',      NULL,     10,        19,         22,              NULL,             5,                                 40,                1,            4), -- x → Videospel (Elektronica)
('fashion-show-organizer', 'Modeshoworganisator',   NULL,     11,        20,         22,              NULL,             5,                                 40,                1,            4), -- x → Modeshow (Kleding)
('maintenance-worker',     'Onderhoudsmedewerker',  14,       12,         6,         NULL,            1,                5,                                 40,                1,            4), -- x → Infrastructuur (Procedures)
('garbage-collector',      'Vuilnisophaler',        22,       13,        16,         22,              1,                5,                                 40,                1,            4), -- Zwerfvuil → Vuilnis (Machines)
('miner',                  'Mijnwerker',            21,       14,         7,         NULL,            1,                5,                                 40,                1,            4), -- Ertsen → Grondstoffen (Energie)
('toolmaker',              'Gereedschapsfabrikant', 14,       15,         7,         NULL,            1,                5,                                 40,                1,            4), -- Grondstoffen → Gereedschap (Energie)
('machine-builder',        'Machinebouwer',         14,       16,        15,         22,              1,                5,                                 40,                1,            4), -- Grondstoffen → Machines (Gereedschap)
('process-operator',       'Procesoperator',        14,       17,        16,         22,              1,                5,                                 40,                1,            4), -- Grondstoffen → Halffabricaten (Machines)
('instrument-maker',       'Instrumentmaker',       17,       18,         6,         NULL,            1,                5,                                 40,                1,            4), -- Halffabricaten → Muziekinstrumenten (Procedures)
('electronics-producer',   'Elektronicaproducent',  17,       19,         6,         NULL,            1,                5,                                 40,                1,            4), -- Halffabricaten → Elektronica (Procedures)
('clothing-producer',      'Kledingproducent',      17,       20,         6,         NULL,            1,                5,                                 40,                1,            4), -- Halffabricaten → Kleding (Procedures)
('recycler',               'Recycler',              13,       14,         7,         NULL,            1,                5,                                 40,                1,            4); -- Vuilnis → Grondstoffen (Energie)

INSERT INTO buildings
(slug,                  type,                  tile_size, job_id) VALUES
('farm',                'Boerderij',           1,          1),
('hospital',            'Ziekenhuis',          1,          2),
('house',               'Woning',              1,          3),
('school',              'School',              1,          4),
('warehouse',           'Magazijn',            1,          5),
('quality-lab',         'Kwaliteitslab',       1,          6),
('wind-park',           'Windmolenpark',       1,          7),
('research-center',     'Onderzoekscentrum',   1,          8),
('concert-hall',        'Concertzaal',         1,          9),
('game-studio',         'Spelstudio',          1,         10),
('fashion-hall',        'Modezaal',            1,         11),
('maintenance-depot',   'Onderhoudsdepot',     1,         12),
('waste-center',        'Vuilniscentrale',     1,         13),
('mine',                'Mijn',                1,         14),
('tool-factory',        'Gereedschapsfabriek', 1,         15),
('machine-factory',     'Machinefabriek',      1,         16),
('processing-plant',    'Verwerkingsfabriek',  1,         17),
('instrument-workshop', 'Instrumentenatelier', 1,         18),
('electronics-factory', 'Elektronicafabriek',  1,         19),
('clothing-factory',    'Kledingfabriek',      1,         20),
('recycling-center',    'Recyclagecentrum',    1,         21);




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