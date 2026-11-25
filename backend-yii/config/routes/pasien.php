<?php

return [
  'GET api/pasien' => 'api/pasien/index',
  'GET api/pasien/<id:\d+>' => 'api/pasien/view',
  'POST api/pasien' => 'api/pasien/create',
  'PUT api/pasien/<id:\d+>' => 'api/pasien/update',
  'DELETE api/pasien/<id:\d+>' => 'api/pasien/delete',
];