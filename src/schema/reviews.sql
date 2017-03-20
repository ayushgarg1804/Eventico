/*
* @Author: Ayush Garg
* @Date:   2017-03-21 01:23:32
* @Last Modified by:   Ayush Garg
* @Last Modified time: 2017-03-21 01:29:16
*/

CREATE TABLE IF NOT EXISTS Reviews
(
	cid INT primary key,
	uid INT,
	stars INT,
	comment VARCHAR,
	posted_time DATETIME,
	foreign key(uid) references users(uid)
);