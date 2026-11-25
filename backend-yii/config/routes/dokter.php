<?php

return [
  'GET api/dokter' => 'api/dokter/index',
  'GET api/dokter/<id:\d+>' => 'api/dokter/view',
  'POST api/dokter' => 'api/dokter/create',
  'PUT api/dokter/<id:\d+>' => 'api/dokter/update',
  'DELETE api/dokter/<id:\d+>' => 'api/dokter/delete',

  'GET api/dokter/references' => 'api/dokter/references',
];