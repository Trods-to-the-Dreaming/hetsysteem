<?php
$logFile = $_SERVER['DOCUMENT_ROOT'] . '/test-cron.txt';
file_put_contents($logFile, date('Y-m-d H:i:s') . " - Cron job uitgevoerd\n", FILE_APPEND);

// Toon laatste regel als feedback
$lines = file($logFile);
echo end($lines);
?>