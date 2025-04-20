CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('jorge', 'jbalibrea.dev', 'hello george');
insert into blogs (author, url, title, likes) values ('frank', 'fullstackopen', 'bybyeee', 20);
