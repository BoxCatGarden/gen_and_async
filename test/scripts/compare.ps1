Param(
  [string]$PathA,
  [string]$PathB,
  [string]$OutputFile
)

$Local = "$(Split-Path -Parent $PSCommandPath)\cache"
foreach ($file in (Get-ChildItem -Path $PathA -File)) {
  $out1 = "$Local\$($file.BaseName)_1.txt"
  $out2 = "$Local\$($file.BaseName)_2.txt"
  node "$($file.FullName)" 2>&1 > $out1
  node "$PathB\$($file.Name)" 2>&1 > $out2
  $file.Name >> $OutputFile
  Compare-Object -ReferenceObject (Get-Content -Path $out1)`
   -DifferenceObject (Get-Content -Path $out2) >>`
   $OutputFile
}
