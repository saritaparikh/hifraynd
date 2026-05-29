-- Add 'planned' value to contact_status enum
alter type contact_status add value 'planned';

-- Add archived column to persons
alter table persons
  add column archived boolean not null default false;

-- Add index for performance — most queries filter archived = false
create index persons_archived_idx on persons(archived);