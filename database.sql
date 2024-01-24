
CREATE FUNCTION public.update_column_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$;
SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE public.customers (
    id bigint NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    coordinate_x DOUBLE PRECISION,
    coordinate_y DOUBLE PRECISION,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);

CREATE SEQUENCE public.customers_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


ALTER TABLE ONLY public.customers
ALTER COLUMN id
SET DEFAULT nextval('public.customers_id_seq'::regclass);


SELECT pg_catalog.setval('public.customers_id_seq', 1, true);


ALTER TABLE ONLY public.customers
ADD CONSTRAINT customers_pk PRIMARY KEY (id);


CREATE TRIGGER update_customer_updated_at BEFORE
UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_column_updated_at();