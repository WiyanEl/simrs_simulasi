<?php

return [
  'GET api/ruangan' => 'api/ruangan/index',
  'GET api/ruangan/<id:\d+>' => 'api/ruangan/view',
  'POST api/ruangan' => 'api/ruangan/create',
  'PUT api/ruangan/<id:\d+>' => 'api/ruangan/update',
  'DELETE api/ruangan/<id:\d+>' => 'api/ruangan/delete',

  'GET api/ruangan/references' => 'api/ruangan/references',
];