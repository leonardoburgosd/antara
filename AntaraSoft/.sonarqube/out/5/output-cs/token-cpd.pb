¶1
eD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Controllers\UsuarioController.cs
	namespace 	
Antara
 
. 
API 
. 
Controllers  
{ 
[ 
Route 

(
 
$str 
) 
] 
[ 
ApiController 
] 
public 

class 
UsuarioController "
:# $

Controller% /
{ 
private 
readonly $
IRegistrarUsuarioService 1#
registrarUsuarioService2 I
;I J
private 
readonly 
ILoginService &
loginService' 3
;3 4
public 
UsuarioController  
(  !$
IRegistrarUsuarioService! 9#
registrarUsuarioService: Q
,Q R
ILoginServiceS `
loginServicea m
)m n
{ 	
this 
. #
registrarUsuarioService (
=) *#
registrarUsuarioService+ B
;B C
this 
. 
loginService 
= 
loginService  ,
;, -
} 	
[ 	
HttpPost	 
] 
public 
async 
Task 
< 
ActionResult &
>& '
CreateUsuarioAsync( :
(: ;
[; <
FromBody< D
]D E
UsuarioF M
usuarioN U
)U V
{ 	
try 
{   
if!! 
(!! #
registrarUsuarioService!! +
.!!+ ,
IsEmailValid!!, 8
(!!8 9
usuario!!9 @
.!!@ A
Email!!A F
)!!F G
.!!G H
Result!!H N
)!!N O
{"" 
var## 

newUsuario## "
=### $
await##% *#
registrarUsuarioService##+ B
.##B C
CreateUsuario##C P
(##P Q
usuario##Q X
)##X Y
;##Y Z
return$$ 
CreatedAtAction$$ *
($$* +
$str$$+ 7
,$$7 8
new$$9 <
{$$= >
id$$? A
=$$B C

newUsuario$$D N
.$$N O
Id$$O Q
}$$R S
,$$S T

newUsuario$$U _
)$$_ `
;$$` a
}%% 
throw&& 
new&& 
ArgumentException&& +
(&&+ ,
$str&&, Z
)&&Z [
;&&[ \
}'' 
catch(( 
((( 
	Exception(( 
err((  
)((  !
{)) 
if** 
(** 
err** 
.** 
Message** 
.**  
Contains**  (
(**( )
$str**) W
)**W X
)**X Y
{++ 
return,, 

StatusCode,, %
(,,% &
$num,,& )
,,,) *
Json,,+ /
(,,/ 0
new,,0 3
{,,4 5
error,,6 ;
=,,< =
err,,> A
.,,A B
Message,,B I
},,J K
),,K L
),,L M
;,,M N
}-- 
throw.. 
;.. 
}// 
}00 	
[33 	
HttpGet33	 
(33 
$str33 
)33 
]33 
public44 
async44 
Task44 
<44 
ActionResult44 &
<44& '
Usuario44' .
>44. /
>44/ 0
GetUsuarioAsync441 @
(44@ A
long44A E
id44F H
)44H I
{55 	
try66 
{77 
Usuario88 
usuario88 
=88  !
await88" '#
registrarUsuarioService88( ?
.88? @

GetUsuario88@ J
(88J K
id88K M
)88M N
;88N O
if99 
(99 
usuario99 
==99 
null99 #
)99# $
return:: 
NotFound:: #
(::# $
)::$ %
;::% &
return;; 
usuario;; 
;;; 
}<< 
catch== 
(== 
	Exception== 
)== 
{>> 
throw?? 
;?? 
}@@ 
}AA 	
[DD 	
HttpPostDD	 
]DD 
[EE 	
RouteEE	 
(EE 
$strEE 
)EE 
]EE 
publicFF 
asyncFF 
TaskFF 
<FF 
ActionResultFF &
>FF& '

LoginAsyncFF( 2
(FF2 3
[FF3 4
FromBodyFF4 <
]FF< =
AuthenticationFF> L
autenticacionFFM Z
)FFZ [
{GG 	
tryHH 
{II 
UsuarioJJ 
userJJ 
=JJ 
awaitJJ $
loginServiceJJ% 1
.JJ1 2
LoginJJ2 7
(JJ7 8
autenticacionJJ8 E
.JJE F
emailJJF K
,JJK L
autenticacionJJM Z
.JJZ [
passwordJJ[ c
)JJc d
;JJd e
returnKK 
JsonKK 
(KK 
newKK 
{KK  !
userKK" &
.KK& '
EmailKK' ,
,KK, -
userKK. 2
.KK2 3
NameKK3 7
,KK7 8
userKK9 =
.KK= >
	BirthDateKK> G
,KKG H
userKKI M
.KKM N
GenderKKN T
,KKT U
userKKV Z
.KKZ [
RegistrationDateKK[ k
,KKk l
userKKm q
.KKq r
CountryKKr y
}KKz {
)KK{ |
;KK| }
}LL 
catchMM 
(MM 
	ExceptionMM 
errMM  
)MM  !
{NN 
ifOO 
(OO 
errOO 
.OO 
MessageOO 
.OO 
ContainsOO '
(OO' (
$strOO( <
)OO< =
)OO= >
{OO> ?
returnPP 

StatusCodePP %
(PP% &
$numPP& )
,PP) *
JsonPP+ /
(PP/ 0
newPP0 3
{PP4 5
errorPP6 ;
=PP< =
errPP> A
.PPA B
MessagePPB I
}PPJ K
)PPK L
)PPL M
;PPM N
}QQ 
throwRR 
;RR 
}SS 
}TT 	
}UU 
}VV ×

OD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Program.cs
	namespace

 	
Antara


 
.

 
API

 
{ 
public 

static 
class 
Program 
{ 
public 
static 
void 
Main 
(  
string  &
[& '
]' (
args) -
)- .
{ 	
CreateHostBuilder 
( 
args "
)" #
.# $
Build$ )
() *
)* +
.+ ,
Run, /
(/ 0
)0 1
;1 2
} 	
public 
static 
IHostBuilder "
CreateHostBuilder# 4
(4 5
string5 ;
[; <
]< =
args> B
)B C
=>D F
Host 
.  
CreateDefaultBuilder %
(% &
args& *
)* +
. $
ConfigureWebHostDefaults )
() *

webBuilder* 4
=>5 7
{ 

webBuilder 
. 

UseStartup )
<) *
Startup* 1
>1 2
(2 3
)3 4
;4 5
} 
) 
; 
} 
} õ*
OD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Startup.cs
	namespace 	
Antara
 
. 
API 
{ 
public 

class 
Startup 
{ 
public 
Startup 
( 
IConfiguration %
configuration& 3
)3 4
{ 	
Configuration 
= 
configuration )
;) *
} 	
public 
IConfiguration 
Configuration +
{, -
get. 1
;1 2
}3 4
public 
void 
ConfigureServices %
(% &
IServiceCollection& 8
services9 A
)A B
{   	
services!! 
.!! 
AddControllers!! #
(!!# $
)!!$ %
;!!% &
services"" 
."" 

AddOptions"" 
(""  
)""  !
;""! "
services## 
.## 
	Configure## 
<## 
AppSettings## *
>##* +
(##+ ,
Configuration##, 9
.##9 :

GetSection##: D
(##D E
$str##E R
)##R S
)##S T
;##T U
services$$ 
.$$ 
AddTransient$$ !
<$$! "
IDapper$$" )
,$$) *
Antara$$+ 1
.$$1 2

Repository$$2 <
.$$< =
Dapper$$= C
.$$C D
Dapper$$D J
>$$J K
($$K L
)$$L M
;$$M N
services%% 
.%% 
AddTransient%% !
<%%! "
IUsuarioRepository%%" 4
,%%4 5
UsuarioRepository%%6 G
>%%G H
(%%H I
)%%I J
;%%J K
services&& 
.&& 
AddTransient&& !
<&&! "$
IRegistrarUsuarioService&&" :
,&&: ;#
RegistrarUsuarioService&&< S
>&&S T
(&&T U
)&&U V
;&&V W
services'' 
.'' 
AddTransient'' !
<''! "
ILoginService''" /
,''/ 0
LoginService''1 =
>''= >
(''> ?
)''? @
;''@ A
services(( 
.(( 
AddTransient(( !
<((! "
IEncryptText((" .
,((. /
EncryptText((0 ;
>((; <
(((< =
)((= >
;((> ?
services00 
.00 
AddSwaggerGen00 "
(00" #
c00# $
=>00% '
{11 
c22 
.22 

SwaggerDoc22 
(22 
$str22 !
,22! "
new22# &
OpenApiInfo22' 2
{223 4
Title225 :
=22; <
$str22= H
,22H I
Version22J Q
=22R S
$str22T X
}22Y Z
)22Z [
;22[ \
}33 
)33 
;33 
services44 
.44 
AddAuthentication44 &
(44& '
)44' (
.55 
	AddGoogle55 
(55 
options55 "
=>55# %
{66 !
IConfigurationSection77 )
googleAuthSection77* ;
=77< =
Configuration77> K
.77K L

GetSection77L V
(77V W
$str77W n
)77n o
;77o p
options88 
.88 
ClientId88 $
=88% &
googleAuthSection88' 8
[888 9
$str889 D
]88D E
;88E F
options99 
.99 
ClientSecret99 (
=99) *
googleAuthSection99+ <
[99< =
$str99= L
]99L M
;99M N
}:: 
):: 
;:: 
}<< 	
public>> 
void>> 
	Configure>> 
(>> 
IApplicationBuilder>> 1
app>>2 5
,>>5 6
IWebHostEnvironment>>7 J
env>>K N
)>>N O
{?? 	
if@@ 
(@@ 
env@@ 
.@@ 
IsDevelopment@@ !
(@@! "
)@@" #
)@@# $
{AA 
appBB 
.BB %
UseDeveloperExceptionPageBB -
(BB- .
)BB. /
;BB/ 0
appCC 
.CC 

UseSwaggerCC 
(CC 
)CC  
;CC  !
appDD 
.DD 
UseSwaggerUIDD  
(DD  !
cDD! "
=>DD# %
cDD& '
.DD' (
SwaggerEndpointDD( 7
(DD7 8
$strDD8 R
,DDR S
$strDDT b
)DDb c
)DDc d
;DDd e
}EE 
appFF 
.FF 
UseCorsFF 
(FF 
$strFF %
)FF% &
;FF& '
appII 
.II 
UseHttpsRedirectionII #
(II# $
)II$ %
;II% &
appKK 
.KK 

UseRoutingKK 
(KK 
)KK 
;KK 
appMM 
.MM 
UseAuthorizationMM  
(MM  !
)MM! "
;MM" #
appOO 
.OO 
UseCorsOO 
(OO 
$strOO -
)OO- .
;OO. /
appQQ 
.QQ 
UseEndpointsQQ 
(QQ 
	endpointsQQ &
=>QQ' )
{RR 
	endpointsSS 
.SS 
MapControllersSS (
(SS( )
)SS) *
;SS* +
}TT 
)TT 
;TT 
}UU 	
}VV 
}WW 