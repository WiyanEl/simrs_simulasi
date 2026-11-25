<?php

return [
  'GET api/pendaftaran' => 'api/pendaftaran/index',
  'GET api/pendaftaran/<id:\d+>' => 'api/pendaftaran/view',
  'POST api/pendaftaran' => 'api/pendaftaran/create',
  'PUT api/pendaftaran/<id:\d+>' => 'api/pendaftaran/update',
  'POST api/pendaftaran/<id:\d+>/batal' => 'api/pendaftaran/batal',
];