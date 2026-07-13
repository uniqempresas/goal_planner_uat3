-- Add missed column to tarefas table to track tasks not executed as planned
ALTER TABLE tarefas ADD COLUMN missed boolean DEFAULT false;
