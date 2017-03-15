/*
* @Author: Aman Priyadarshi
* @Date:   2017-03-15 23:39:17
* @Last Modified by:   Aman Priyadarshi
* @Last Modified time: 2017-03-15 23:39:19
*/

CREATE TABLE IF NOT EXISTS Venues
(
	id INTEGER primary key,
	name VARCHAR,
	longitude NUMERIC,
	latitude NUMERIC,
	city VARCHAR,
	country VARCHAR,
	address VARCHAR
);
