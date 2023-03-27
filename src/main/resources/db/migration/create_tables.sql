CREATE TABLE IF NOT EXISTS public.user
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    username character varying(20) NOT NULL,
    password varchar NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (id),
    CONSTRAINT username_pk UNIQUE (username)
    )

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user
    OWNER to managecost;

CREATE TABLE IF NOT EXISTS public.trip
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    version integer NOT NULL DEFAULT 0,
    name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    place character varying(32) COLLATE pg_catalog."default" NOT NULL,
    sum money NOT NULL DEFAULT 0.00,
    CONSTRAINT trip_pk PRIMARY KEY (id)
    )

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.trip
    OWNER to costcount;

CREATE TABLE IF NOT EXISTS public.person
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT person_pk PRIMARY KEY (id)
    )

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.person
    OWNER to costcount;

CREATE TABLE IF NOT EXISTS public.person_trip
(
    person_id uuid NOT NULL,
    trip_id uuid NOT NULL,
    sum money NOT NULL DEFAULT 0.00,
    CONSTRAINT person_fk FOREIGN KEY (person_id)
    REFERENCES public.person (id) MATCH SIMPLE
    ON UPDATE RESTRICT
    ON DELETE RESTRICT,
    CONSTRAINT trip_fk FOREIGN KEY (trip_id)
    REFERENCES public.trip (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    )

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.person_trip
    OWNER to costcount;

CREATE TABLE IF NOT EXISTS public.activity
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    version integer NOT NULL DEFAULT 0,
    trip_id uuid NOT NULL,
    name character varying(32) COLLATE pg_catalog."default" NOT NULL,
    date date NOT NULL,
    sum money NOT NULL,
    CONSTRAINT activity_pk PRIMARY KEY (id),
    CONSTRAINT trip_fk FOREIGN KEY (trip_id)
    REFERENCES public.trip (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    )

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.activity
    OWNER to costcount;

CREATE TABLE IF NOT EXISTS public.record
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    activity_id uuid NOT NULL,
    person_id uuid NOT NULL,
    land_money money,
    borrow_money money,
    CONSTRAINT record_pk PRIMARY KEY (id),
    CONSTRAINT activity_fk FOREIGN KEY (activity_id)
    REFERENCES public.activity (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    CONSTRAINT person_fk FOREIGN KEY (person_id)
    REFERENCES public.person (id) MATCH SIMPLE
    ON UPDATE RESTRICT
    ON DELETE RESTRICT
    )

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.record
    OWNER to costcount;

-- DROP TABLE IF EXISTS public.record;
-- DROP TABLE IF EXISTS public.activity;
-- DROP TABLE IF EXISTS public.person_trip;
-- DROP TABLE IF EXISTS public.trip;
-- DROP TABLE IF EXISTS public.person;