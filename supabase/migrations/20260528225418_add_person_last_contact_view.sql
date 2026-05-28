create or replace view persons_with_last_contact as
select
  p.*,
  max(i.interaction_date) as last_contact_date
from persons p
left join interactions i on i.person_id = p.id
group by p.id;