INSERT INTO users(username, password, enabled, email_flag, default_assessment) VALUES('test', '$2a$10$q/11Js6oFiqrkRl05yjRaunA.tggeqfxCB6lNGodj6rqlZHVqWs76', true, true, null);
INSERT INTO authorities VALUES('test', 'ROLE_USER');

INSERT INTO users(username, password, enabled, email_flag, default_assessment) VALUES('admin', '$2a$10$rQ.bdTyQSNVkTM5N9IXu7uZ1v9Oe5rpDJ.qDQuZS1tOUBq5X9fu6y', true, true, null);
INSERT INTO authorities VALUES('admin', 'ROLE_ADMIN');
INSERT INTO authorities VALUES('admin', 'ROLE_USER');
