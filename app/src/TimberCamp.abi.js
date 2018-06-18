module.exports = [{"constant":true,"inputs":[{"name":"_x","type":"uint16"},{"name":"_y","type":"uint16"},{"name":"_tile","type":"uint8"}],"name":"canCollect","outputs":[{"name":"amount","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"galleass","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_galleass","type":"address"}],"name":"upgradeGalleass","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"resource","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"max","outputs":[{"name":"","type":"bytes2"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint16"},{"name":"","type":"uint16"},{"name":"","type":"uint8"}],"name":"lastBlock","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxCollect","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_amount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_sender","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"onTokenTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_contract","type":"address"},{"name":"_permission","type":"bytes32"}],"name":"hasPermission","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_x","type":"uint16"},{"name":"_y","type":"uint16"},{"name":"_tile","type":"uint8"}],"name":"collect","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint16"},{"name":"","type":"uint16"},{"name":"","type":"uint8"}],"name":"landOwners","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_x","type":"uint16"},{"name":"_y","type":"uint16"},{"name":"_tile","type":"uint8"},{"name":"_owner","type":"address"},{"name":"_amount","type":"uint256"}],"name":"onPurchase","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"getContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"min","outputs":[{"name":"","type":"bytes2"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_galleass","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"data","type":"bytes"}],"name":"TokenTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_x","type":"uint16"},{"indexed":false,"name":"_y","type":"uint16"},{"indexed":false,"name":"_tile","type":"uint8"},{"indexed":false,"name":"_block","type":"uint64"},{"indexed":false,"name":"_hash","type":"bytes32"}],"name":"Debug","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_x","type":"uint16"},{"indexed":false,"name":"_y","type":"uint16"},{"indexed":false,"name":"_tile","type":"uint8"},{"indexed":false,"name":"_owner","type":"address"}],"name":"LandOwner","type":"event"}]