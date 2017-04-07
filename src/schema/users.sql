/*
* @Author: Ayush Garg
* @Date:   2017-03-21 00:35:35
* @Last Modified by:   Ayush Garg
* @Last Modified time: 2017-04-08 00:13:17
*/

CREATE TABLE IF NOT EXISTS Users
(
	uid INTEGER primary key NOT NULL,
	username VARCHAR,
	password VARCHAR,
	email VARCHAR,
	full_name VARCHAR,
	user_level INTEGER DEFAULT 0
);
