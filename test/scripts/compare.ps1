Param(
  [string]$PathA,
  [string]$PathB,
  [string]$OutputFile
)

$Local = Split-Path -Parent $PSCommandPath
foreach ($file in (Get-ChildItem -Path $PathA -File)) {
  node $file.FullName &> "$Local\out1.txt"
  node "$PathB\$($file.Name)" &> "$Local\out2.txt"
  $file.Name >> $OutputFile
  Compare-Object -ReferenceObject (Get-Content -Path "$Local\out1.txt")`
   -DifferenceObject (Get-Content -Path "$Local\out2.txt") >>`
   $OutputFile
}
