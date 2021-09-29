œ5
eD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Controllers\UsuarioController.cs
	namespace 	
Antara
 
. 
API 
. 
Controllers  
{		 
[

 
Route

 

(


 
$str

 
)

 
]

 
[ 
ApiController 
] 
public 

class 
UsuarioController "
:# $

Controller% /
{ 
private 
readonly $
IRegistrarUsuarioService 1#
registrarUsuarioService2 I
;I J
private 
readonly 
ILoginService &
loginService' 3
;3 4
public 
UsuarioController  
(  !$
IRegistrarUsuarioService! 9#
registrarUsuarioService: Q
,Q R
ILoginServiceS `
loginServicea m
)m n
{ 	
this 
. #
registrarUsuarioService (
=) *#
registrarUsuarioService+ B
;B C
this 
. 
loginService 
= 
loginService  ,
;, -
} 	
[ 	
HttpPost	 
] 
public 
async 
Task 
< 
ActionResult &
>& '
CreateUsuarioAsync( :
(: ;
[; <
FromBody< D
]D E
UsuarioF M
usuarioN U
)U V
{ 	
try 
{ 
if 
( #
registrarUsuarioService +
.+ ,
IsEmailValid, 8
(8 9
usuario9 @
.@ A
EmailA F
)F G
.G H
ResultH N
)N O
{ 
var 

newUsuario "
=# $
await% *#
registrarUsuarioService+ B
.B C
CreateUsuarioC P
(P Q
usuarioQ X
)X Y
;Y Z
return 
CreatedAtAction *
(* +
$str+ 7
,7 8
new9 <
{= >
id? A
=B C

newUsuarioD N
.N O
IdO Q
}R S
,S T

newUsuarioU _
)_ `
;` a
}   
throw!! 
new!! 
ArgumentException!! +
(!!+ ,
$str!!, Z
)!!Z [
;!![ \
}"" 
catch## 
(## 
	Exception## 
err##  
)##  !
{$$ 
if%% 
(%% 
err%% 
.%% 
Message%% 
.%%  
Contains%%  (
(%%( )
$str%%) W
)%%W X
||&& 
err&& 
.&& 
Message&& "
.&&" #
Contains&&# +
(&&+ ,
$str&&, I
)&&I J
)&&J K
{'' 
return(( 

StatusCode(( %
(((% &
$num((& )
,(() *
Json((+ /
(((/ 0
new((0 3
{((4 5
error((6 ;
=((< =
err((> A
.((A B
Message((B I
}((J K
)((K L
)((L M
;((M N
})) 
else** 
return** 

StatusCode** &
(**& '
$num**' *
,*** +
err**, /
)**/ 0
;**0 1
}++ 
},, 	
[// 	
HttpGet//	 
(// 
$str// 
)// 
]// 
public00 
async00 
Task00 
<00 
ActionResult00 &
<00& '
Usuario00' .
>00. /
>00/ 0
GetUsuarioAsync001 @
(00@ A
long00A E
id00F H
)00H I
{11 	
try22 
{33 
Usuario44 
usuario44 
=44  !
await44" '#
registrarUsuarioService44( ?
.44? @

GetUsuario44@ J
(44J K
id44K M
)44M N
;44N O
if55 
(55 
usuario55 
==55 
null55 #
)55# $
return66 
NotFound66 #
(66# $
)66$ %
;66% &
return77 

StatusCode77 !
(77! "
$num77" %
,77% &
usuario77' .
)77. /
;77/ 0
}88 
catch99 
(99 
	Exception99 
err99  
)99  !
{:: 
return;; 

StatusCode;; !
(;;! "
$num;;" %
,;;% &
err;;' *
);;* +
;;;+ ,
}<< 
}== 	
[@@ 	
HttpPost@@	 
]@@ 
[AA 	
RouteAA	 
(AA 
$strAA 
)AA 
]AA 
publicBB 
asyncBB 
TaskBB 
<BB 
ActionResultBB &
>BB& '

LoginAsyncBB( 2
(BB2 3
[BB3 4
FromBodyBB4 <
]BB< =
AuthenticationBB> L
autenticacionBBM Z
)BBZ [
{CC 	
tryDD 
{EE 
UsuarioFF 
userFF 
=FF 
awaitFF $
loginServiceFF% 1
.FF1 2
LoginFF2 7
(FF7 8
autenticacionFF8 E
.FFE F
emailFFF K
,FFK L
autenticacionFFM Z
.FFZ [
passwordFF[ c
)FFc d
;FFd e
returnGG 
JsonGG 
(GG 
newGG 
{GG  !
userGG" &
.GG& '
EmailGG' ,
,GG, -
userGG. 2
.GG2 3
NameGG3 7
,GG7 8
userGG9 =
.GG= >
	BirthDateGG> G
,GGG H
userGGI M
.GGM N
GenderGGN T
,GGT U
userGGV Z
.GGZ [
RegistrationDateGG[ k
,GGk l
userGGm q
.GGq r
CountryGGr y
}GGz {
)GG{ |
;GG| }
}HH 
catchII 
(II 
	ExceptionII 
errII  
)II  !
{JJ 
ifKK 
(KK 
errKK 
.KK 
MessageKK 
.KK 
ContainsKK '
(KK' (
$strKK( <
)KK< =
)KK= >
{KK> ?
returnLL 

StatusCodeLL %
(LL% &
$numLL& )
,LL) *
JsonLL+ /
(LL/ 0
newLL0 3
{LL4 5
errorLL6 ;
=LL< =
errLL> A
.LLA B
MessageLLB I
}LLJ K
)LLK L
)LLL M
;LLM N
}MM 
throwNN 
;NN 
}OO 
}PP 	
}QQ 
}RR ×

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