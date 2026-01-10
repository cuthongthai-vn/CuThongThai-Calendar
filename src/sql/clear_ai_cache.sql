-- Clear AI Commentary Cache Script
-- Run this to remove cached error messages and force fresh AI generation

-- Clear all commentary from events where it contains error messages
UPDATE economic_events 
SET ai_commentary = NULL, 
    ai_sentiment = NULL, 
    vn_impact = NULL,
    translated_name = NULL
WHERE ai_commentary LIKE '%mất chìa khóa%' 
   OR ai_commentary LIKE '%mất kết nối%'
   OR ai_commentary LIKE '%nghỉ ngơi%';

-- Show affected rows
SELECT COUNT(*) as cleared_events 
FROM economic_events 
WHERE ai_commentary IS NULL;
