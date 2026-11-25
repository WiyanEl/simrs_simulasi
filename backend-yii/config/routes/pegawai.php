<?php

return [
  'GET api/pegawai' => 'api/pegawai/index',
  'GET api/pegawai/<id:\d+>' => 'api/pegawai/view',
  'POST api/pegawai' => 'api/pegawai/create',
  'PUT api/pegawai/<id:\d+>' => 'api/pegawai/update',
  'DELETE api/pegawai/<id:\d+>' => 'api/pegawai/delete',

  'GET api/pegawai/references' => 'api/pegawai/references',
  'GET api/pegawai/references-all' => 'api/pegawai/references-all',
];