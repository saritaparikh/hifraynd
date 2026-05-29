-- Recreate view to pick up the archived column added after initial creation.
-- create or replace is not allowed when the column list changes, so we drop and recreate.

drop view persons_with_last_contact;

create view persons_with_last_contact as
select
  p.*,
  max(i.interaction_date) as last_contact_date
from persons p
left join interactions i on i.person_id = p.id
group by p.id;

alter view persons_with_last_contact set (security_invoker = true);