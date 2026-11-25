<?php

return [
  'GET api/jadwal-dokter' => 'api/jadwal-dokter/index',
  'GET api/jadwal-dokter/<id:\d+>' => 'api/jadwal-dokter/view',
  'POST api/jadwal-dokter' => 'api/jadwal-dokter/create',
  'PUT api/jadwal-dokter/<id:\d+>' => 'api/jadwal-dokter/update',
  'DELETE api/jadwal-dokter/<id:\d+>' => 'api/jadwal-dokter/delete',
];