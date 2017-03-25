/*
* @Author: Ayush Garg
* @Date:   2017-03-21 01:23:32
* @Last Modified by:   Ayush Garg
* @Last Modified time: 2017-03-25 23:30:50
*/

CREATE TABLE IF NOT EXISTS Reviews
(
	cid INTEGER primary key NOT NULL,
	eid INTEGER,
	uid INTEGER,
	stars INTEGER,
	comment VARCHAR,
	posted_time DATETIME,
	foreign key(uid) references users(uid),
	foreign key(eid) references events(id)
);