$Local = Split-Path -Parent $PSCommandPath
$Project = $Local\..\..
$Output = $Local\..\output

$Local\compare.ps1`
"$Project\nodejs\test\async_func"`
"$Project\test_native\async_func"`
$Output\async_func.txt

$Local\compare.ps1`
"$Project\nodejs\test\async_gen"`
"$Project\test_native\async_gen"`
$Output\async_gen.txt

$Local\compare.ps1`
"$Project\nodejs\test\async_gen_gen"`
"$Project\test_native\async_gen"`
$Output\async_gen_gen.txt
