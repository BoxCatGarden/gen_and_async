$Local = Split-Path -Parent $PSCommandPath
$Project = "$Local\..\.."
$Output = "$Local\..\output"

'' > "$Output\async_func.txt"
& "$Local\compare.ps1" `
"$Project\nodejs\test\async_func" `
"$Project\test_native\async_func" `
"$Output\async_func.txt" `
'01'

'' > "$Output\async_gen.txt"
& "$Local\compare.ps1" `
"$Project\nodejs\test\async_gen" `
"$Project\test_native\async_gen" `
"$Output\async_gen.txt" `
'02'

'' > "$Output\async_gen_gen.txt"
& "$Local\compare.ps1" `
"$Project\nodejs\test\async_gen_gen" `
"$Project\test_native\async_gen" `
"$Output\async_gen_gen.txt" `
'03'
