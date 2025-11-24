<?php
$env = getenv('NODE_ENV') ?: 'development';

if ($env === 'production') {
    $url = 'https://www.hetsysteem.site/cron/process-actions';
} else {
    $url = 'http://localhost:3000/cron/process-actions';
}

$options = [
  'http' => [
    'method' => 'GET',
    'header' => "Authorization: Bearer 4321\r\n"
  ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
  http_response_code(500);
  echo "Cron job mislukt.";
} else {
  echo "Cron job succesvol uitgevoerd.";
}
?>