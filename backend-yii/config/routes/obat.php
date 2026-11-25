<?php

return [
  'GET api/obat' => 'api/obat/index',
  'GET api/obat/<id:\d+>' => 'api/obat/view',
  'POST api/obat' => 'api/obat/create',
  'PUT api/obat/<id:\d+>' => 'api/obat/update',
  'DELETE api/obat/<id:\d+>' => 'api/obat/delete',
];