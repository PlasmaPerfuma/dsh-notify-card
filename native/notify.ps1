$ErrorActionPreference = 'Stop'

[Console]::InputEncoding = New-Object System.Text.UTF8Encoding($false)
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)

Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase

# ---------------------------------------------------------------------------
# [local patch] Theme.


# Follows the Windows app theme (AppsUseLightTheme). The dark palette is the


# exact inverse of the light one, so the two stay consistent.


# ---------------------------------------------------------------------------
$script:themeDark = $false
try {
  $personalize = Get-ItemProperty -Path ' HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize ' -Name ' AppsUseLightTheme ' -ErrorAction Stop
  $script:themeDark = ($personalize.AppsUseLightTheme -eq 0)
} catch { }
# Follow DSH's own appearance setting first: it lives in plain text inside the
# profile at <profile>\cordis.patch.yml -> ui-theme -> config.preference.
# The profile is deliberately NOT derived from a fixed number of parent hops:
# that only worked when the package sat inside <profile>\node_modules, and broke
# as soon as it was installed from elsewhere (e.g. a linked local checkout).
function Get-DshThemePreference {
  $candidates = New-Object System.Collections.ArrayList
  if ($env:DSH_NOTIFY_PROFILE) { [void]$candidates.Add((Join-Path $env:DSH_NOTIFY_PROFILE 'cordis.patch.yml')) }
  $dir = $PSScriptRoot
  for ($i = 0; $i -lt 6 -and $dir; $i++) {
    [void]$candidates.Add((Join-Path $dir 'cordis.patch.yml'))
    $dir = Split-Path $dir -Parent
  }
  if ($env:USERPROFILE) {
    $root = Join-Path $env:USERPROFILE '.dsh\profiles'
    if (Test-Path -LiteralPath $root) {
      Get-ChildItem -LiteralPath $root -Directory -ErrorAction SilentlyContinue |
        ForEach-Object { [void]$candidates.Add((Join-Path $_.FullName 'cordis.patch.yml')) }
    }
  }
  foreach ($c in $candidates) {
    try {
      if (-not (Test-Path -LiteralPath $c)) { continue }
      $txt = [System.IO.File]::ReadAllText($c, [System.Text.Encoding]::UTF8)
      $m = [regex]::Match($txt, 'dsh-client-ui-theme[\s\S]{0,400}?preference:\s*([A-Za-z]+)')
      if ($m.Success) { return $m.Groups[1].Value.ToLower() }
    } catch { }
  }
  return ''
}
try {
  $dshPref = Get-DshThemePreference
  if ($dshPref -eq 'dark') { $script:themeDark = $true }
  elseif ($dshPref -eq 'light') { $script:themeDark = $false }
} catch { }
$themeOverride = "$env:DSH_NOTIFY_THEME".Trim().ToLower()
if ($themeOverride -eq 'dark') { $script:themeDark = $true }
if ($themeOverride -eq 'light') { $script:themeDark = $false }

$script:darkPalette = @{
  '#FFFFFF' = '#0F172A'; '#F8FAFC' = '#0B1220'; '#F1F5F9' = '#1E293B'
  '#E2E8F0' = '#334155'; '#CBD5E1' = '#475569'; '#64748B' = '#94A3B8'
  '#475569' = '#CBD5E1'; '#334155' = '#E2E8F0'; '#0F172A' = '#F8FAFC'
  '#1F2937' = '#E5E7EB'; '#4F46E5' = '#A5B4FC'; '#0284C7' = '#7DD3FC'
  '#0EA5E9' = '#38BDF8'; '#DC2626' = '#FCA5A5'; '#D7DEE8' = '#3B4757'
  '#B91C1C' = '#F87171'; '#059669' = '#34D399'
}

function Convert-Theme {
  param([string]$Color)
  if (-not $script:themeDark -or [string]::IsNullOrEmpty($Color)) { return $Color }
  $key = $Color.ToUpper()
  if ($script:darkPalette.ContainsKey($key)) { return $script:darkPalette[$key] }
  return $Color
}

function Convert-ThemeText {
  param([string]$Text)
  if (-not $script:themeDark) { return $Text }
  return [regex]::Replace($Text, '#[0-9A-Fa-f]{6}', { param($m) $k = $m.Value.ToUpper(); if ($script:darkPalette.ContainsKey($k)) { $script:darkPalette[$k] } else { $m.Value } })
}

function ConvertFrom-Utf8Base64 {
  param([string]$Value)
  return [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($Value))
}

# Fallback wording. Every show message may carry a `labels` block written in the
# host language; these constants only apply when a label is missing from it.
$textHeader = ConvertFrom-Utf8Base64 'WmV0YSDpgJrnn6U='
$textQuestion = ConvertFrom-Utf8Base64 '6Zeu6aKYIA=='
$textCustom = ConvertFrom-Utf8Base64 '5YW25LuW77yP6KGl5YWF'
$textSubmit = ConvertFrom-Utf8Base64 '6YCB5Ye65Zue562U'
$textLater = ConvertFrom-Utf8Base64 '56iN5ZCO5aSE55CG'
$textPleaseComplete = ConvertFrom-Utf8Base64 '6K+35a6M5oiQ44CM'
$textClosingQuote = ConvertFrom-Utf8Base64 '44CN44CC'
$textSubmitted = ConvertFrom-Utf8Base64 '5bey6YCB5Ye677yM562J5b6F56Gu6K6k4oCm'
$textExclusive = ConvertFrom-Utf8Base64 '5Y2V6YCJ6aKY6K+36YCJ5oup6YCJ6aG55oiW5aGr5YaZ5YW25LuW77yM5LiN6IO95ZCM5pe25L2/55So44CC'
$textCustomTooLong = ConvertFrom-Utf8Base64 '6KGl5YWF5paH5a2X5LiN5Y+v6LaF6L+HIDE2MDAwIOWtl+WFg+OAgg=='
$textLastError = ConvertFrom-Utf8Base64 '5LiK5qyh6YCB5Ye65pyq6YCa6L+H77ya'
$textAllowOnce = ConvertFrom-Utf8Base64 '5YWB6K645LiA5qyh'
$textReject = ConvertFrom-Utf8Base64 '5ouS57ud'
$textClose = ConvertFrom-Utf8Base64 '5YWz6Zet'
$textDefaultTitle = ConvertFrom-Utf8Base64 'RFNIIOmAmuefpQ=='
$textTool = ConvertFrom-Utf8Base64 '5bel5YW377ya'
$textReason = ConvertFrom-Utf8Base64 '5Y6f5Zug77ya'

$xaml = @'
<Window WindowStyle="None" AllowsTransparency="True" xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="Zeta &#x901A;&#x77E5;"
        Width="476"
        MinHeight="160"
        MaxHeight="650"
        SizeToContent="Height"
        ResizeMode="NoResize"
        Topmost="True"
        WindowStartupLocation="Manual"
        Background="Transparent"
        Foreground="#1F2937"
        ShowInTaskbar="False">
        <Window.Resources>
        <!-- [local patch] slim scrollbar: the stock one is huge and ugly -->
        <Style TargetType="ScrollBar">
          <Setter Property="Width" Value="7" />
          <Setter Property="MinWidth" Value="7" />
          <Setter Property="MaxWidth" Value="7" />
          <Setter Property="HorizontalAlignment" Value="Right" />
          <Setter Property="Background" Value="Transparent" />
          <Setter Property="Template">
            <Setter.Value>
              <ControlTemplate TargetType="ScrollBar">
                <Grid Background="Transparent">
                  <Track x:Name="PART_Track" IsDirectionReversed="True">
                    <Track.DecreaseRepeatButton>
                      <RepeatButton Command="ScrollBar.PageUpCommand" Opacity="0" Focusable="False" />
                    </Track.DecreaseRepeatButton>
                    <Track.Thumb>
                      <Thumb>
                        <Thumb.Template>
                          <ControlTemplate TargetType="Thumb">
                            <Border x:Name="tb" CornerRadius="3" Background="#CBD5E1" Margin="1,0,1,0" />
                            <ControlTemplate.Triggers>
                              <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="tb" Property="Background" Value="#94A3B8" />
                              </Trigger>
                            </ControlTemplate.Triggers>
                          </ControlTemplate>
                        </Thumb.Template>
                      </Thumb>
                    </Track.Thumb>
                    <Track.IncreaseRepeatButton>
                      <RepeatButton Command="ScrollBar.PageDownCommand" Opacity="0" Focusable="False" />
                    </Track.IncreaseRepeatButton>
                  </Track>
                </Grid>
              </ControlTemplate>
            </Setter.Value>
          </Setter>
        </Style>
        <!-- [local patch] the box that holds long operation detail -->
        <Style x:Key="ZetaDetailBox" TargetType="ScrollViewer">
          <Setter Property="MaxHeight" Value="160" />
          <Setter Property="VerticalScrollBarVisibility" Value="Auto" />
          <Setter Property="HorizontalScrollBarVisibility" Value="Disabled" />
          <Setter Property="Background" Value="#F1F5F9" />
          <Setter Property="Padding" Value="9,7,4,7" />
        </Style>
      </Window.Resources>
      <Border BorderBrush="#E2E8F0" BorderThickness="1" CornerRadius="14" Background="#FFFFFF" Margin="18">
      <Border.Effect>
        <DropShadowEffect BlurRadius="28" ShadowDepth="5" Direction="270" Opacity="0.22" Color="#000000" />
      </Border.Effect>
    <Grid>
      <Grid.RowDefinitions>
        <RowDefinition Height="0" />
        <RowDefinition Height="*" />
      </Grid.RowDefinitions>
      <Grid Grid.Row="0" Margin="18,0,18,0" Visibility="Collapsed">
        <Grid.ColumnDefinitions>
          <ColumnDefinition Width="*" />
          <ColumnDefinition Width="Auto" />
        </Grid.ColumnDefinitions>
        <TextBlock x:Name="HeaderTitle" Text="Zeta &#x901A;&#x77E5;" FontSize="17" FontWeight="SemiBold" VerticalAlignment="Center" />
        <Border Grid.Column="1" CornerRadius="10" Background="#F1F5F9" Padding="9,4" VerticalAlignment="Center">
          <TextBlock Text="DSH" FontSize="11" Foreground="#64748B" />
        </Border>
      </Grid>
      <ScrollViewer x:Name="CardsScroll" Grid.Row="1" VerticalScrollBarVisibility="Auto" HorizontalScrollBarVisibility="Disabled" Padding="10,10,10,10">
        <StackPanel x:Name="CardsPanel" />
      </ScrollViewer>
    </Grid>
  </Border>
</Window>
'@

$xaml = Convert-ThemeText $xaml
$reader = New-Object System.Xml.XmlNodeReader ([xml]$xaml)
$window = [Windows.Markup.XamlReader]::Load($reader)
$window.Add_MouseLeftButtonDown({ try { $window.DragMove() } catch { } })
$cardsPanel = $window.FindName('CardsPanel')
$headerTitle = $window.FindName('HeaderTitle')
$cards = @{}
$isShuttingDown = $false

function Write-Diagnostic {
  param([string]$Message)
  [Console]::Error.WriteLine($Message)
}

function Write-Protocol {
  param([object]$Message)
  $json = ConvertTo-Json -InputObject $Message -Compress -Depth 16
  [Console]::Out.WriteLine($json)
  [Console]::Out.Flush()
}

function Has-Property {
  param([object]$Object, [string]$Name)
  return $null -ne $Object -and $null -ne $Object.PSObject.Properties[$Name]
}

function Get-Property {
  param([object]$Object, [string]$Name, [object]$Default = $null)
  if (Has-Property $Object $Name) {
    return $Object.PSObject.Properties[$Name].Value
  }
  return $Default
}

function Get-Text {
  param([object]$Object, [string]$Name)
  $value = Get-Property $Object $Name ''
  if ($null -eq $value) { return '' }
  return [string]$value
}

function Get-Label {
  param([object]$Labels, [string]$Name, [string]$Fallback)
  $value = Get-Property $Labels $Name $null
  if ($value -is [string] -and $value.Length -gt 0) { return $value }
  return $Fallback
}

$zetaFocusSource = 'using System;using System.Runtime.InteropServices;public class ZetaFocus{[DllImport("user32.dll")]static extern IntPtr GetForegroundWindow();[DllImport("user32.dll")]static extern int GetWindowThreadProcessId(IntPtr h,out int pid);public static bool ForegroundIsDsh(){try{var h=GetForegroundWindow();if(h==IntPtr.Zero)return false;int pid;GetWindowThreadProcessId(h,out pid);var p=System.Diagnostics.Process.GetProcessById(pid);return p.ProcessName.IndexOf("DeepSeek",StringComparison.OrdinalIgnoreCase)>=0;}catch{return false;}}}'
Add-Type -TypeDefinition $zetaFocusSource

# [local patch] focus oracle state
$script:dshFocused = $null
$script:focusCheckedAt = 0 
function Get-Brush {
  param([string]$Color)
  return (New-Object System.Windows.Media.BrushConverter).ConvertFromString((Convert-Theme $Color))
}

function New-Text {
  param(
    [string]$Text,
    [double]$Size = 13,
    [string]$Color = '#475569',
    [string]$Weight = 'Normal',
    [double]$Bottom = 6
  )
  # [local patch] type scale lifted to DSH sizes (base 14px)
  $sizeMap = @{ 10 = 11; 11 = 12; 13 = 14; 15 = 16; 17 = 18 }
  if ($sizeMap.ContainsKey([int]$Size)) { $Size = $sizeMap[[int]$Size] }
  $control = New-Object System.Windows.Controls.TextBlock
  $control.Text = $Text
  $control.FontSize = $Size
  $control.Foreground = Get-Brush $Color
  $control.FontWeight = [System.Windows.FontWeights]::$Weight
  $control.TextWrapping = [System.Windows.TextWrapping]::Wrap
  $control.Margin = New-Object System.Windows.Thickness(0, 0, 0, $Bottom)
  return $control
}

function New-DetailBox {
  # [local patch] long content lives in its own capped scroller, wrapped in a
  # clearly delimited box (border + tint + soft shadow) so the card itself never
  # grows a giant scrollbar and the buttons stay reachable. -Proportional keeps
  # prose readable while code-like detail stays monospaced; the box is identical.
  param([string]$Text, [switch]$Proportional)
  $outer = New-Object System.Windows.Controls.Border
  $outer.CornerRadius = New-Object System.Windows.CornerRadius(9)
  $outer.Background = Get-Brush '#F1F5F9'
  $outer.BorderBrush = Get-Brush '#CBD5E1'
  $outer.BorderThickness = New-Object System.Windows.Thickness(1)
  $outer.Margin = New-Object System.Windows.Thickness(0, 2, 0, 9)
  $eff = New-Object System.Windows.Media.Effects.DropShadowEffect
  $eff.BlurRadius = 7
  $eff.ShadowDepth = 1
  $eff.Direction = 270
  $eff.Opacity = 0.12
  $eff.Color = [System.Windows.Media.Colors]::Black
  $outer.Effect = $eff

  $sv = New-Object System.Windows.Controls.ScrollViewer
  try { $sv.Style = $window.FindResource('ZetaDetailBox') } catch { $sv.MaxHeight = 160 }
  $sv.Background = [System.Windows.Media.Brushes]::Transparent
  $sv.BorderThickness = New-Object System.Windows.Thickness(0)
  $tb = New-Object System.Windows.Controls.TextBlock
  $tb.Text = $Text
  if ($Proportional) {
    $tb.FontSize = 14
  } else {
    $tb.FontFamily = New-Object System.Windows.Media.FontFamily('Consolas, Cascadia Mono, monospace')
    $tb.FontSize = 12
  }
  $tb.TextWrapping = [System.Windows.TextWrapping]::Wrap
  $tb.Foreground = Get-Brush '#475569'
  $sv.Content = $tb
  $outer.Child = $sv
  return $outer
}

function New-ActionButton {
  param(
    [string]$Label,
    [string]$Background = '#E2E8F0',
    [string]$Foreground = '#0F172A',
    [string]$Outline = '#D7DEE8'
  )
  # [local patch] DSH-style action button: 12px radius (= --dsw-radius-md),
  # 14px label (= --dsh-content-font-size) and a roomier hit area.
  $button = New-Object System.Windows.Controls.Button
  $button.Background = [System.Windows.Media.Brushes]::Transparent
  $button.BorderThickness = New-Object System.Windows.Thickness(0)
  $button.Padding = New-Object System.Windows.Thickness(0)
  $button.Margin = New-Object System.Windows.Thickness(0, 0, 8, 0)
  $button.Cursor = [System.Windows.Input.Cursors]::Hand
  $button.Template = [Windows.Markup.XamlReader]::Parse('<ControlTemplate xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation" TargetType="Button"><ContentPresenter HorizontalAlignment="Center" VerticalAlignment="Center" /><ControlTemplate.Triggers><Trigger Property="IsMouseOver" Value="True"><Setter Property="Opacity" Value="0.85" /></Trigger><Trigger Property="IsEnabled" Value="False"><Setter Property="Opacity" Value="0.45" /></Trigger></ControlTemplate.Triggers></ControlTemplate>')
  $border = New-Object System.Windows.Controls.Border
  $border.CornerRadius = New-Object System.Windows.CornerRadius(12)
  $border.Background = Get-Brush $Background
  $border.BorderBrush = Get-Brush $Outline
  $border.BorderThickness = New-Object System.Windows.Thickness(1)
  $border.Padding = New-Object System.Windows.Thickness(18, 9, 18, 9)
  $labelControl = New-Object System.Windows.Controls.TextBlock
  $labelControl.Text = $Label
  $labelControl.FontSize = 14
  $labelControl.Foreground = Get-Brush $Foreground
  $labelControl.FontWeight = [System.Windows.FontWeights]::SemiBold
  $border.Child = $labelControl
  $button.Content = $border
  return $button
}

function New-MetadataMessage {
  param([string]$Type, [object]$Event)
  $message = [ordered]@{
    type = $Type
    id = Get-Text $Event 'id'
  }
  foreach ($name in @('requestId', 'sessionId', 'token')) {
    if (Has-Property $Event $name) {
      $message[$name] = Get-Property $Event $name
    }
  }
  return $message
}

function Update-WindowPosition {
  $workArea = [System.Windows.SystemParameters]::WorkArea
  $height = $window.ActualHeight
  if ($height -le 0) { $height = $window.DesiredSize.Height }
  if ($height -le 0) { $height = 220 }
  $window.Left = [Math]::Max($workArea.Left + 12, $workArea.Right - $window.Width - 16)
  $window.Top = [Math]::Max($workArea.Top + 12, $workArea.Bottom - $height - 16)
}

function Show-Window {
  param([bool]$Interactive)
  if (-not $window.IsVisible) {
    $window.Show()
  }
  $window.Dispatcher.BeginInvoke(
    [System.Windows.Threading.DispatcherPriority]::Loaded,
    [Action]{ Update-WindowPosition }
  ) | Out-Null
  if ($Interactive) {
    $window.Activate() | Out-Null
  }
}

function Remove-Card {
  param([string]$Id)
  if (-not $cards.ContainsKey($Id)) { return }
  $entry = $cards[$Id]
  $cardsPanel.Children.Remove($entry.Card) | Out-Null
  $cards.Remove($Id)
  if ($cards.Count -eq 0) {
    $window.Hide()
  } else {
    Update-WindowPosition
  }
}

function Add-Option {
  param(
    [System.Windows.Controls.StackPanel]$Panel,
    [object]$Option,
    [bool]$MultiSelect,
    [string]$GroupName,
    [System.Collections.ArrayList]$OptionStates
  )
  $row = New-Object System.Windows.Controls.StackPanel
  $row.Margin = New-Object System.Windows.Thickness(0, 1, 0, 5)

  if ($MultiSelect) {
    $selector = New-Object System.Windows.Controls.CheckBox
  } else {
    $selector = New-Object System.Windows.Controls.RadioButton
    $selector.GroupName = $GroupName
  }
  $selector.Foreground = Get-Brush '#334155'
  $selector.VerticalContentAlignment = [System.Windows.VerticalAlignment]::Top
  $selector.Margin = New-Object System.Windows.Thickness(0, 1, 0, 0)

  $label = Get-Text $Option 'label'
  $labelControl = New-Text $label 13 '#334155' 'Normal' 0
  $selector.Content = $labelControl
  $row.Children.Add($selector) | Out-Null

  $description = Get-Text $Option 'description'
  if ($description) {
    $descriptionControl = New-Text $description 11 '#64748B' 'Normal' 0
    $descriptionControl.Margin = New-Object System.Windows.Thickness(24, 2, 0, 0)
    $row.Children.Add($descriptionControl) | Out-Null
  }
  $Panel.Children.Add($row) | Out-Null
  $OptionStates.Add([pscustomobject]@{ Label = $label; Control = $selector }) | Out-Null
}

function Add-Question {
  param(
    [System.Windows.Controls.StackPanel]$Panel,
    [object]$Question,
    [int]$Index,
    [System.Collections.ArrayList]$AnswerStates,
    [object]$Labels
  )
  $questionPanel = New-Object System.Windows.Controls.StackPanel
  $questionPanel.Margin = New-Object System.Windows.Thickness(0, 8, 0, 7)

  $header = Get-Text $Question 'header'
  if (-not $header) { $header = (Get-Label $Labels 'questionPrefix' $script:textQuestion) + ($Index + 1) }
  $questionPanel.Children.Add((New-Text $header 11 '#0EA5E9' 'SemiBold' 3)) | Out-Null
  $questionPanel.Children.Add((New-Text (Get-Text $Question 'question') 13 '#0F172A' 'SemiBold' 4)) | Out-Null

  $detail = Get-Text $Question 'detail'
  if ($detail) {
    $questionPanel.Children.Add((New-DetailBox $detail)) | Out-Null
  }

  $multiSelect = [bool](Get-Property $Question 'multiSelect' $false)
  $optionStates = New-Object System.Collections.ArrayList
  $groupName = 'q_' + [Guid]::NewGuid().ToString('N')
  $options = @(Get-Property $Question 'options' @())
  foreach ($option in $options) {
    Add-Option $questionPanel $option $multiSelect $groupName $optionStates
  }

  $customLabel = New-Text (Get-Label $Labels 'custom' $script:textCustom) 11 '#64748B' 'Normal' 3
  $custom = New-Object System.Windows.Controls.TextBox
  $custom.AcceptsReturn = $true
  $custom.MaxLength = 16000
  $custom.MinHeight = 34
  $custom.MaxHeight = 90
  $custom.TextWrapping = [System.Windows.TextWrapping]::Wrap
  $custom.VerticalScrollBarVisibility = [System.Windows.Controls.ScrollBarVisibility]::Auto
  $custom.Background = Get-Brush '#F8FAFC'
  $custom.Foreground = Get-Brush '#0F172A'
  $custom.BorderBrush = Get-Brush '#CBD5E1'
  $custom.Padding = New-Object System.Windows.Thickness(7, 5, 7, 5)
  $questionPanel.Children.Add($customLabel) | Out-Null
  $questionPanel.Children.Add($custom) | Out-Null

  if (-not $multiSelect) {
    $statesForCustom = $optionStates
    $custom.Add_TextChanged({
      if ($custom.Text.Length -gt 0) {
        foreach ($optionState in $statesForCustom) {
          $optionState.Control.IsChecked = $false
        }
      }
    }.GetNewClosure())
    foreach ($optionState in $optionStates) {
      $selectorForCustom = $optionState.Control
      $selectorForCustom.Add_Checked({
        if ($selectorForCustom.IsChecked -eq $true -and $custom.Text.Length -gt 0) {
          $custom.Clear()
        }
      }.GetNewClosure())
    }
  }

  $Panel.Children.Add($questionPanel) | Out-Null
  $AnswerStates.Add([pscustomobject]@{
    Id = Get-Text $Question 'id'
    Header = $header
    MultiSelect = $multiSelect
    Options = $optionStates
    Custom = $custom
  }) | Out-Null
}

function Add-QuestionActions {
  param(
    [System.Windows.Controls.StackPanel]$Panel,
    [object]$Event,
    [System.Collections.ArrayList]$AnswerStates,
    [string]$Id,
    [object]$Labels
  )
  # Resolved before the click closures so GetNewClosure captures this card's
  # wording even after a later card arrives in another language.
  $tooLongText = Get-Label $Labels 'customTooLong' $script:textCustomTooLong
  $exclusiveText = Get-Label $Labels 'exclusive' $script:textExclusive
  $completePrefix = Get-Label $Labels 'pleaseComplete' $script:textPleaseComplete
  $completeSuffix = Get-Label $Labels 'closingQuote' $script:textClosingQuote
  $submittedText = Get-Label $Labels 'submitted' $script:textSubmitted

  $validation = New-Text '' 11 '#DC2626' 'Normal' 4
  $validation.Visibility = [System.Windows.Visibility]::Collapsed
  $Panel.Children.Add($validation) | Out-Null

  $buttons = New-Object System.Windows.Controls.StackPanel
  $buttons.Orientation = [System.Windows.Controls.Orientation]::Horizontal
  $buttons.Margin = New-Object System.Windows.Thickness(0, 6, 0, 0)
  $submit = New-ActionButton (Get-Label $Labels 'submit' $script:textSubmit) '#0284C7'
  $dismiss = New-ActionButton (Get-Label $Labels 'later' $script:textLater) '#E2E8F0'
  $buttons.Children.Add($submit) | Out-Null
  $buttons.Children.Add($dismiss) | Out-Null
  $Panel.Children.Add($buttons) | Out-Null

  $submit.Add_Click({
    $answers = New-Object System.Collections.ArrayList
    foreach ($state in $AnswerStates) {
      $selected = New-Object System.Collections.ArrayList
      foreach ($optionState in $state.Options) {
        if ($optionState.Control.IsChecked -eq $true) {
          $selected.Add($optionState.Label) | Out-Null
        }
      }
      $custom = $state.Custom.Text.Trim()
      if ($custom.Length -gt 16000) {
        $validation.Text = $tooLongText
        $validation.Visibility = [System.Windows.Visibility]::Visible
        return
      }
      if (-not $state.MultiSelect -and $selected.Count -gt 0 -and $custom) {
        $validation.Text = $exclusiveText
        $validation.Visibility = [System.Windows.Visibility]::Visible
        return
      }
      if ($selected.Count -eq 0 -and -not $custom) {
        $validation.Text = $completePrefix + $state.Header + $completeSuffix
        $validation.Visibility = [System.Windows.Visibility]::Visible
        return
      }
      $answer = [ordered]@{
        id = $state.Id
        selected = @($selected.ToArray())
      }
      if ($custom) { $answer['custom'] = $custom }
      $answers.Add($answer) | Out-Null
    }
    $message = New-MetadataMessage 'respond' $Event
    $message['answers'] = @($answers.ToArray())
    Write-Protocol $message
    $submit.IsEnabled = $false
    $dismiss.IsEnabled = $false
    $validation.Text = $submittedText
    $validation.Foreground = Get-Brush '#0284C7'
    $validation.Visibility = [System.Windows.Visibility]::Visible
  }.GetNewClosure())

  $dismiss.Add_Click({
    Write-Protocol (New-MetadataMessage 'dismiss' $Event)
    Remove-Card $Id
  }.GetNewClosure())
}

function Add-ApprovalActions {
  param(
    [System.Windows.Controls.StackPanel]$Panel,
    [object]$Event,
    [string]$Id,
    [object]$Labels
  )
  $status = New-Text (Get-Label $Labels 'submitted' $script:textSubmitted) 11 '#0284C7' 'Normal' 4
  $status.Visibility = [System.Windows.Visibility]::Collapsed
  $Panel.Children.Add($status) | Out-Null
  $buttons = New-Object System.Windows.Controls.StackPanel
  $buttons.Orientation = [System.Windows.Controls.Orientation]::Horizontal
  $buttons.Margin = New-Object System.Windows.Thickness(0, 9, 0, 0)
  $allow = New-ActionButton (Get-Label $Labels 'allowOnce' $script:textAllowOnce) '#0F172A' '#FFFFFF'
  $reject = New-ActionButton (Get-Label $Labels 'reject' $script:textReject) '#FFFFFF' '#0F172A'
  $buttons.Children.Add($allow) | Out-Null
  $buttons.Children.Add($reject) | Out-Null
  $Panel.Children.Add($buttons) | Out-Null

  $allow.Add_Click({
    $message = New-MetadataMessage 'respond' $Event
    $message['decision'] = 'allowed-once'
    Write-Protocol $message
    $allow.IsEnabled = $false
    $reject.IsEnabled = $false
    $status.Visibility = [System.Windows.Visibility]::Visible
  }.GetNewClosure())
  $reject.Add_Click({
    $message = New-MetadataMessage 'respond' $Event
    $message['decision'] = 'rejected'
    Write-Protocol $message
    $allow.IsEnabled = $false
    $reject.IsEnabled = $false
    $status.Visibility = [System.Windows.Visibility]::Visible
  }.GetNewClosure())
  }

function Add-DismissAction {
  param(
    [System.Windows.Controls.StackPanel]$Panel,
    [object]$Event,
    [string]$Id,
    [object]$Labels
  )
  $dismiss = New-ActionButton (Get-Label $Labels 'close' $script:textClose) '#E2E8F0'
  $dismiss.Margin = New-Object System.Windows.Thickness(0, 7, 0, 0)
  $Panel.Children.Add($dismiss) | Out-Null
  $dismiss.Add_Click({
    Write-Protocol (New-MetadataMessage 'dismiss' $Event)
    Remove-Card $Id
  }.GetNewClosure())
}

function Show-Notification {
  param([object]$Event, [object]$Settings, [object]$Labels)
  $id = Get-Text $Event 'id'
  if (-not $id) { throw 'show event requires a non-empty id' }
  Remove-Card $id

  $headerText = Get-Label $Labels 'header' $script:textHeader
  $window.Title = $headerText
  $script:headerTitle.Text = $headerText

  $card = New-Object System.Windows.Controls.Border
  $card.Background = Get-Brush '#F1F5F9'
  $card.BorderBrush = Get-Brush '#E2E8F0'
  $card.BorderThickness = New-Object System.Windows.Thickness(1)
  $card.CornerRadius = New-Object System.Windows.CornerRadius(11)
  $card.Padding = New-Object System.Windows.Thickness(14)
  $card.Margin = New-Object System.Windows.Thickness(0, 0, 0, 9)

  $content = New-Object System.Windows.Controls.StackPanel
  $card.Child = $content

  $kind = Get-Text $Event 'kind'
  $questions = @(Get-Property $Event 'questions' @())
  $interactive =
    [bool](Get-Text $Event 'requestId') -or
    [bool](Get-Text $Event 'token') -or
    $questions.Count -gt 0 -or
    $kind -in @('question', 'approval', 'plan')
  $previewEnabled = -not (Has-Property $Settings 'preview') -or [bool](Get-Property $Settings 'preview' $true)
  $showDetails = $interactive -or $previewEnabled
  $kindLabel = if ($kind) { $kind.ToUpperInvariant() } else { 'NOTICE' }
  $content.Children.Add((New-Text $kindLabel 10 '#0EA5E9' 'SemiBold' 4)) | Out-Null

  $title = Get-Text $Event 'title'
  if (-not $showDetails -or -not $title) { $title = Get-Label $Labels 'defaultTitle' $script:textDefaultTitle }
  $content.Children.Add((New-Text $title 15 '#0F172A' 'SemiBold' 5)) | Out-Null

  $body = Get-Text $Event 'body'
  if ($showDetails -and $body) { $content.Children.Add((New-DetailBox $body -Proportional)) | Out-Null }

  $detail = Get-Text $Event 'detail'
  if ($showDetails -and $detail) { $content.Children.Add((New-DetailBox $detail)) | Out-Null }

  $toolName = Get-Text $Event 'toolName'
  if ($showDetails -and $toolName) { $content.Children.Add((New-Text ((Get-Label $Labels 'tool' $script:textTool) + $toolName) 11 '#4F46E5' 'SemiBold' 3)) | Out-Null }
  $reason = Get-Text $Event 'reason'
  if ($showDetails -and $reason) { $content.Children.Add((New-Text ((Get-Label $Labels 'reason' $script:textReason) + $reason) 13 '#334155' 'Normal' 7)) | Out-Null }

  $submissionError = Get-Text $Event 'error'
  if ($submissionError) {
    $content.Children.Add((New-Text ((Get-Label $Labels 'lastError' $script:textLastError) + $submissionError) 11 '#DC2626' 'SemiBold' 7)) | Out-Null
  }

  $answerStates = New-Object System.Collections.ArrayList
  for ($index = 0; $index -lt $questions.Count; $index++) {
    Add-Question $content $questions[$index] $index $answerStates $Labels
  }

  if ($kind -eq 'approval') {
    Add-ApprovalActions $content $Event $id $Labels
  } elseif ($questions.Count -gt 0) {
    Add-QuestionActions $content $Event $answerStates $id $Labels
  } else {
    Add-DismissAction $content $Event $id $Labels
  }

  $persistent = $interactive
  $expiresAt = if ($persistent) { $null } else { [DateTime]::UtcNow.AddSeconds(8) }
  $cards[$id] = [pscustomobject]@{ Card = $card; ExpiresAt = $expiresAt }
  $cardsPanel.Children.Add($card) | Out-Null

  $sound = [bool](Get-Property $Settings 'sound' $false)
  $volume = [double](Get-Property $Settings 'volume' 1.0)
  if ($sound -and $volume -gt 0) {
    [System.Media.SystemSounds]::Asterisk.Play()
  }
  Show-Window $persistent
  Write-Protocol ([ordered]@{ type = 'shown'; id = $id })
}

function Shutdown-Helper {
  $script:isShuttingDown = $true
  $script:timer.Stop()
  $window.Close()
  $script:application.Shutdown()
}

function Handle-InputLine {
  param([string]$Line)
  if (-not $Line) { return }
  $message = ConvertFrom-Json -InputObject $Line -ErrorAction Stop
  $type = Get-Text $message 'type'
  switch ($type) {
    'show' {
      Show-Notification (Get-Property $message 'event') (Get-Property $message 'settings' ([pscustomobject]@{})) (Get-Property $message 'labels')
    }
    'close' {
      Remove-Card (Get-Text $message 'id')
    }
    'shutdown' {
      Shutdown-Helper
    }
    default {
      throw ('Unknown message type: ' + $type)
    }
  }
}

$window.Add_Closing({
  param($sender, $eventArgs)
  if (-not $script:isShuttingDown) {
    $eventArgs.Cancel = $true
    $sender.Hide()
  }
})

$application = New-Object System.Windows.Application
$application.ShutdownMode = [System.Windows.ShutdownMode]::OnExplicitShutdown
$application.Add_DispatcherUnhandledException({
  param($sender, $eventArgs)
  Write-Diagnostic ('Fatal native UI error: ' + $eventArgs.Exception.Message)
  $eventArgs.Handled = $true
  Shutdown-Helper
})

$stdinStream = [Console]::OpenStandardInput()
$stdinReader = New-Object System.IO.StreamReader(
  $stdinStream,
  (New-Object System.Text.UTF8Encoding($false)),
  $true,
  4096,
  $true
)
$pendingRead = $stdinReader.ReadLineAsync()
$timer = New-Object System.Windows.Threading.DispatcherTimer
$timer.Interval = [TimeSpan]::FromMilliseconds(50)
$timer.Add_Tick({
  # [local patch] tell the host whether the DSH window owns the foreground
  $now = (Get-Date).Ticks
  if ($now - $script:focusCheckedAt -gt 5000000) {
    $script:focusCheckedAt = $now
    try {
      $fg = [ZetaFocus]::ForegroundIsDsh()
      if ($fg -ne $script:dshFocused) {
        $script:dshFocused = $fg
        Write-Protocol ([ordered]@{ type = 'focus'; focused = $fg })
      }
    } catch { }
  }
  try {
    if ($script:pendingRead.IsCompleted) {
      $line = $script:pendingRead.GetAwaiter().GetResult()
      if ($null -eq $line) {
        Shutdown-Helper
        return
      }
      try {
        Handle-InputLine $line
      } catch {
        Write-Diagnostic ('Invalid native helper input: ' + $_.Exception.Message)
      }
      if (-not $script:isShuttingDown) {
        $script:pendingRead = $script:stdinReader.ReadLineAsync()
      }
    }

    $expired = New-Object System.Collections.ArrayList
    foreach ($id in @($script:cards.Keys)) {
      $expiresAt = $script:cards[$id].ExpiresAt
      if ($null -ne $expiresAt -and [DateTime]::UtcNow -ge $expiresAt) {
        $expired.Add($id) | Out-Null
      }
    }
    foreach ($id in $expired) { Remove-Card $id }
  } catch {
    Write-Diagnostic ('Fatal native helper error: ' + $_.Exception.Message)
    Shutdown-Helper
  }
})

$workArea = [System.Windows.SystemParameters]::WorkArea
$window.MaxHeight = [Math]::Min(650, [Math]::Max(220, $workArea.Height - 24))
Write-Protocol ([ordered]@{ type = 'ready' })
$timer.Start()
[void]$application.Run()
