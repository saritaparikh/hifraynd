-- Add cadence_days to persons
-- Number of days between intended touchpoints for this relationship
alter table persons
  add column cadence_days integer;

-- Add title to interactions  
-- Short label for the interaction, separate from full notes
alter table interactions
  add column title text;

