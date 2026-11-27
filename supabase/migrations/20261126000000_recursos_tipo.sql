-- Tipo de recurso: distingue el material de estudio del material de consulta.
-- Sin esta columna la profesora creaba unidades falsas ("Referencias Unidad 1")
-- para separar la bibliografia del contenido de trabajo, y la barra de progreso
-- le pedia al alumno marcar 34 referencias como si fueran lecciones.

alter table public.recursos
  add column tipo text not null default 'teoria';

alter table public.recursos
  add constraint recursos_tipo_check
  check (tipo in ('teoria', 'actividad', 'evaluacion', 'referencia'));

-- Las unidades que hoy solo sirven de bibliografia pasan a ser referencias.
-- Los triggers se apagan durante el relleno: ponen updated_at en now() y el
-- panel usa esa fecha para avisar que una unidad lleva mucho sin tocarse.
-- Un relleno tecnico no es una edicion de contenido y no debe borrar ese aviso.
alter table public.recursos disable trigger recursos_set_updated_at;
alter table public.recursos disable trigger recursos_touch_unidad;

update public.recursos
set tipo = 'referencia'
where unidad_id in (
  select id from public.unidades where titulo ilike 'referencias%'
);

alter table public.recursos enable trigger recursos_set_updated_at;
alter table public.recursos enable trigger recursos_touch_unidad;
