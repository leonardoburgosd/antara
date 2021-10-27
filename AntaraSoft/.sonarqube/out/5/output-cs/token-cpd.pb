¬`
cD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Controllers\AlbumController.cs
	namespace 	
Antara
 
. 
API 
. 
Controllers  
{ 
[ 
Route 

(
 
$str 
) 
] 
[ 
ApiController 
] 
public 

class 
AlbumController  
:! "

Controller# -
{ 
private 
readonly "
IGestionarAlbumService /"
_gestionarAlbumService0 F
;F G
private 
const 
string 
directorioId )
=* +
$str, O
;O P
public 
AlbumController 
( "
IGestionarAlbumService 5!
gestionarAlbumService6 K
)K L
{ 	"
_gestionarAlbumService "
=# $!
gestionarAlbumService% :
;: ;
} 	
[ 	
HttpPost	 
] 
public 
async 
Task 
< 
ActionResult &
<& '
AlbumDto' /
>/ 0
>0 1
CrearAlbumAsync2 A
(A B
[B C
FromFormC K
]K L
CrearAgrupacionDtoM _
crearAlbumDto` m
,m n
[o p
FromFormp x
]x y
	IFormFile	z É
imagenDePortada
Ñ ì
)
ì î
{ 	
try 
{ 
Album   

albumNuevo    
=  ! "
new  # &
(  & '
)  ' (
{!! 
Id"" 
="" 
Guid"" 
."" 
NewGuid"" %
(""% &
)""& '
,""' (
Nombre## 
=## 
crearAlbumDto## *
.##* +
Nombre##+ 1
,##1 2
Descripcion$$ 
=$$  !
crearAlbumDto$$" /
.$$/ 0
Descripcion$$0 ;
,$$; <
FechaPublicacion%% $
=%%% &
DateTime%%' /
.%%/ 0
Parse%%0 5
(%%5 6
$str%%6 B
)%%B C
,%%C D
EstaPublicado&& !
=&&" #
false&&$ )
,&&) *
	UsuarioId'' 
='' 
crearAlbumDto''  -
.''- .
	UsuarioId''. 7
,''7 8

EstaActivo(( 
=((  
true((! %
})) 
;)) 
if** 
(** 
imagenDePortada** #
==**$ &
null**' +
)**+ ,
{++ 

albumNuevo,, 
.,, 

PortadaUrl,, )
=,,* +
null,,, 0
;,,0 1
}-- 
else.. 
{// 
string00 
url00 
=00  
await00! &

Extensions00' 1
.001 2
SubirArchivo002 >
(00> ?
imagenDePortada00? N
,00N O
directorioId00P \
)00\ ]
;00] ^

albumNuevo11 
.11 

PortadaUrl11 )
=11* +
url11, /
.11/ 0
Replace110 7
(117 8
$str118 J
,11J K
$str11L N
)11N O
;11O P
}22 
await33 "
_gestionarAlbumService33 ,
.33, -

CrearAlbum33- 7
(337 8

albumNuevo338 B
)33B C
;33C D
return44 
CreatedAtAction44 &
(44& '
$str44' 5
,445 6
new447 :
{44; <
id44= ?
=44@ A

albumNuevo44B L
.44L M
Id44M O
}44P Q
,44Q R

albumNuevo44S ]
.44] ^
AsDto44^ c
(44c d
)44d e
)44e f
;44f g
}55 
catch66 
(66 
	Exception66 
err66  
)66  !
{77 
if88 
(88 
err88 
.88 
Message88 
.88  
Contains88  (
(88( )
$str88) D
)88D E
)88E F
{99 
return:: 

StatusCode:: %
(::% &
$num::& )
,::) *
Json::+ /
(::/ 0
new::0 3
{::4 5
error::6 ;
=::< =
err::> A
.::A B
Message::B I
}::J K
)::K L
)::L M
;::M N
};; 
else<< 
return<< 

StatusCode<< &
(<<& '
$num<<' *
,<<* +
err<<, /
.<</ 0
Message<<0 7
)<<7 8
;<<8 9
}== 
}>> 	
[@@ 	
HttpGet@@	 
(@@ 
$str@@ 
)@@ 
]@@ 
publicAA 
asyncAA 
TaskAA 
<AA 
ActionResultAA &
<AA& '
AlbumDtoAA' /
>AA/ 0
>AA0 1
ObtenerAlbumAsyncAA2 C
(AAC D
GuidAAD H
idAAI K
)AAK L
{BB 	
tryCC 
{DD 
varEE 
albumEE 
=EE 
awaitEE !"
_gestionarAlbumServiceEE" 8
.EE8 9
ObtenerAlbumEE9 E
(EEE F
idEEF H
)EEH I
;EEI J
ifFF 
(FF 
albumFF 
==FF 
nullFF !
)FF! "
{GG 
returnHH 
NotFoundHH #
(HH# $
)HH$ %
;HH% &
}II 
returnJJ 

StatusCodeJJ !
(JJ! "
$numJJ" %
,JJ% &
albumJJ' ,
.JJ, -
AsDtoJJ- 2
(JJ2 3
)JJ3 4
)JJ4 5
;JJ5 6
}KK 
catchLL 
(LL 
	ExceptionLL 
errLL  
)LL  !
{MM 
returnNN 

StatusCodeNN !
(NN! "
$numNN" %
,NN% &
errNN' *
.NN* +
MessageNN+ 2
)NN2 3
;NN3 4
}OO 
}PP 	
[RR 	
HttpGetRR	 
(RR 
$strRR !
)RR! "
]RR" #
publicSS 
asyncSS 
TaskSS 
<SS 
ActionResultSS &
<SS& '
ListSS' +
<SS+ ,
AlbumDtoSS, 4
>SS4 5
>SS5 6
>SS6 7-
!ObtenerTodosAlbumesDeUsuarioAsyncSS8 Y
(SSY Z
GuidSSZ ^
userIdSS_ e
)SSe f
{TT 	
tryUU 
{VV 
varWW 
	albumListWW 
=WW 
(WW  !
awaitWW! &"
_gestionarAlbumServiceWW' =
.WW= >(
ObtenerTodosAlbumesDeUsuarioWW> Z
(WWZ [
userIdWW[ a
)WWa b
)WWb c
.WWc d
SelectWWd j
(WWj k
itemWWk o
=>WWp r
itemWWs w
.WWw x
AsDtoWWx }
(WW} ~
)WW~ 
)	WW Ä
;
WWÄ Å
returnXX 

StatusCodeXX !
(XX! "
$numXX" %
,XX% &
	albumListXX' 0
)XX0 1
;XX1 2
}YY 
catchZZ 
(ZZ 
	ExceptionZZ 
errZZ  
)ZZ  !
{[[ 
return\\ 

StatusCode\\ !
(\\! "
$num\\" %
,\\% &
err\\' *
.\\* +
Message\\+ 2
)\\2 3
;\\3 4
}]] 
}^^ 	
[`` 	
HttpPut``	 
]`` 
publicaa 
asyncaa 
Taskaa 
<aa 
ActionResultaa &
>aa& '
EditarAlbumAsyncaa( 8
(aa8 9
Guidaa9 =
idaa> @
,aa@ A
EditarAgrupacionDtoaaB U
editarAlbumDtoaaV d
)aad e
{bb 	
trycc 
{dd 
Albumee 
albumee 
=ee 
awaitee #"
_gestionarAlbumServiceee$ :
.ee: ;
ObtenerAlbumee; G
(eeG H
ideeH J
)eeJ K
;eeK L
ifff 
(ff 
albumff 
==ff 
nullff !
)ff! "
{gg 
returnhh 
NotFoundhh #
(hh# $
)hh$ %
;hh% &
}ii 
Albumjj 
albumEditadojj "
=jj# $
albumjj% *
withjj+ /
{kk 
Nombrell 
=ll 
editarAlbumDtoll +
.ll+ ,
Nombrell, 2
,ll2 3
Descripcionmm 
=mm  !
editarAlbumDtomm" 0
.mm0 1
Descripcionmm1 <
,mm< =

PortadaUrlnn 
=nn  
editarAlbumDtonn! /
.nn/ 0

PortadaUrlnn0 :
}oo 
;oo 
awaitpp "
_gestionarAlbumServicepp ,
.pp, -
EditarAlbumpp- 8
(pp8 9
albumEditadopp9 E
)ppE F
;ppF G
returnqq 

StatusCodeqq !
(qq! "
$numqq" %
)qq% &
;qq& '
}rr 
catchss 
(ss 
	Exceptionss 
errss  
)ss  !
{tt 
returnuu 

StatusCodeuu !
(uu! "
$numuu" %
,uu% &
erruu' *
.uu* +
Messageuu+ 2
)uu2 3
;uu3 4
}vv 
}ww 	
[yy 	

HttpDeleteyy	 
(yy 
$stryy 
)yy 
]yy 
publiczz 
asynczz 
Taskzz 
<zz 
ActionResultzz &
>zz& '
EliminarAlbumAsynczz( :
(zz: ;
Guidzz; ?
idzz@ B
)zzB C
{{{ 	
try|| 
{}} 
var~~ 
grupo~~ 
=~~ 
await~~ !"
_gestionarAlbumService~~" 8
.~~8 9
ObtenerAlbum~~9 E
(~~E F
id~~F H
)~~H I
;~~I J
if 
( 
grupo 
== 
null !
)! "
{
ÄÄ 
return
ÅÅ 
NotFound
ÅÅ #
(
ÅÅ# $
)
ÅÅ$ %
;
ÅÅ% &
}
ÇÇ 
await
ÉÉ $
_gestionarAlbumService
ÉÉ ,
.
ÉÉ, -
EliminarAlbum
ÉÉ- :
(
ÉÉ: ;
id
ÉÉ; =
)
ÉÉ= >
;
ÉÉ> ?
return
ÑÑ 

StatusCode
ÑÑ !
(
ÑÑ! "
$num
ÑÑ" %
)
ÑÑ% &
;
ÑÑ& '
}
ÖÖ 
catch
ÜÜ 
(
ÜÜ 
	Exception
ÜÜ 
err
ÜÜ  
)
ÜÜ  !
{
áá 
return
àà 

StatusCode
àà !
(
àà! "
$num
àà" %
,
àà% &
err
àà' *
.
àà* +
Message
àà+ 2
)
àà2 3
;
àà3 4
}
ââ 
}
ää 	
[
åå 	
HttpPut
åå	 
(
åå 
$str
åå !
)
åå! "
]
åå" #
public
çç 
async
çç 
Task
çç 
<
çç 
ActionResult
çç &
>
çç& '
PublicarAlbum
çç( 5
(
çç5 6
Guid
çç6 :
id
çç; =
)
çç= >
{
éé 	
try
èè 
{
êê 
var
ëë 
grupo
ëë 
=
ëë 
await
ëë !$
_gestionarAlbumService
ëë" 8
.
ëë8 9
ObtenerAlbum
ëë9 E
(
ëëE F
id
ëëF H
)
ëëH I
;
ëëI J
if
íí 
(
íí 
grupo
íí 
==
íí 
null
íí !
)
íí! "
{
ìì 
return
îî 
NotFound
îî #
(
îî# $
id
îî$ &
)
îî& '
;
îî' (
}
ïï 
await
ññ $
_gestionarAlbumService
ññ ,
.
ññ, -
PublicarAlbum
ññ- :
(
ññ: ;
grupo
ññ; @
)
ññ@ A
;
ññA B
return
óó 

StatusCode
óó !
(
óó! "
$num
óó" %
)
óó% &
;
óó& '
}
òò 
catch
ôô 
(
ôô 
	Exception
ôô 
err
ôô  
)
ôô  !
{
öö 
return
õõ 

StatusCode
õõ !
(
õõ! "
$num
õõ" %
,
õõ% &
err
õõ' *
.
õõ* +
Message
õõ+ 2
)
õõ2 3
;
õõ3 4
}
úú 
}
ùù 	
}
ûû 
}üü äÖ
cD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Controllers\PistaController.cs
	namespace 	
Antara
 
. 
API 
. 
Controllers  
{ 
[ 
Route 

(
 
$str 
) 
] 
[ 
ApiController 
] 
public 

class 
PistaController  
:! "

Controller# -
{ 
private 
readonly "
IGestionarPistaService /"
_gestionarPistaService0 F
;F G
private 
const 
string 
directorioId )
=* +
$str, O
;O P
public 
PistaController 
( "
IGestionarPistaService 5!
gestionarpistaService6 K
)K L
{ 	"
_gestionarPistaService "
=# $!
gestionarpistaService% :
;: ;
} 	
[ 	
HttpPost	 
] 
public 
async 
Task 
< 
ActionResult &
<& '
PistaDto' /
>/ 0
>0 1
CrearPistaAsync2 A
(A B
[B C
FromFormC K
]K L
CrearPistaDtoL Y
pistaDtoZ b
,b c
[c d
FromFormd l
]l m
	IFormFilen w
archivox 
)	 Ä
{ 	
try 
{   
if!! 
(!! 
archivo!! 
==!! 
null!! #
)!!# $
{"" 
throw## 
new## !
ArgumentNullException## 3
(##3 4
nameof##4 :
(##: ;
archivo##; B
)##B C
)##C D
;##D E
}$$ 
Pista%% 

pistaNueva%%  
=%%! "
new%%# &
(%%& '
)%%' (
{&& 
Id'' 
='' 
Guid'' 
.'' 
NewGuid'' %
(''% &
)''& '
,''' (
Nombre(( 
=(( 
Path(( !
.((! "'
GetFileNameWithoutExtension((" =
(((= >
archivo((> E
.((E F
FileName((F N
)((N O
,((O P
FechaRegistro)) !
=))" #
DateTime))$ ,
.)), -
Now))- 0
,))0 1
AnoCreacion** 
=**  !
pistaDto**" *
.*** +
AnoCreacion**+ 6
,**6 7

Interprete++ 
=++  
pistaDto++! )
.++) *

Interprete++* 4
,++4 5

Compositor,, 
=,,  
pistaDto,,! )
.,,) *

Compositor,,* 4
,,,4 5
	Productor-- 
=-- 
pistaDto--  (
.--( )
	Productor--) 2
,--2 3
Reproducciones.. "
=..# $
$num..% &
,..& '
GeneroId// 
=// 
pistaDto// '
.//' (
GeneroId//( 0
,//0 1
AlbumId00 
=00 
pistaDto00 &
.00& '
AlbumId00' .
,00. /

EstaActivo11 
=11  
true11! %
}22 
;22 
if33 
(33 "
_gestionarPistaService33 )
.33) *
SonDatosValidos33* 9
(339 :

pistaNueva33: D
)33D E
)33E F
{44 
string55 
url55 
=55  
await55! &

Extensions55' 1
.551 2
SubirArchivo552 >
(55> ?
archivo55? F
,55F G
directorioId55H T
,55T U
$str55V b
)55b c
;55c d
if66 
(66 
url66 
!=66 
null66 #
)66# $
{77 

pistaNueva88 "
.88" #
Url88# &
=88' (
url88) ,
.88, -
Replace88- 4
(884 5
$str885 G
,88G H
$str88I K
)88K L
;88L M
await99 "
_gestionarPistaService99 4
.994 5

CrearPista995 ?
(99? @

pistaNueva99@ J
)99J K
;99K L
return:: 
CreatedAtAction:: .
(::. /
$str::/ =
,::= >
new::? B
{::C D
id::E G
=::H I

pistaNueva::J T
.::T U
Id::U W
}::X Y
,::Y Z

pistaNueva::[ e
.::e f
AsDto::f k
(::k l
)::l m
)::m n
;::n o
};; 
throw<< 
new<< !
ArgumentNullException<< 3
(<<3 4
nameof<<4 :
(<<: ;
url<<; >
)<<> ?
,<<? @
$str<<A l
)<<l m
;<<m n
}== 
throw>> 
new>> 
ArgumentException>> +
(>>+ ,
$str>>, B
,>>B C
nameof>>D J
(>>J K
pistaDto>>K S
)>>S T
)>>T U
;>>U V
}?? 
catch@@ 
(@@ 
	Exception@@ 
err@@  
)@@  !
{AA 
ifBB 
(BB 
errBB 
.BB 
MessageBB 
.BB  
ContainsBB  (
(BB( )
$strBB) D
)BBD E
)BBE F
{CC 
returnDD 

StatusCodeDD %
(DD% &
$numDD& )
,DD) *
JsonDD+ /
(DD/ 0
newDD0 3
{DD4 5
errorDD6 ;
=DD< =
errDD> A
.DDA B
MessageDDB I
}DDJ K
)DDK L
)DDL M
;DDM N
}EE 
elseFF 
returnFF 

StatusCodeFF &
(FF& '
$numFF' *
,FF* +
errFF, /
.FF/ 0
MessageFF0 7
.FF7 8
ToStringFF8 @
(FF@ A
)FFA B
)FFB C
;FFC D
}GG 
}HH 	
[JJ 	
HttpGetJJ	 
(JJ 
$strJJ (
)JJ( )
]JJ) *
publicKK 
asyncKK 
TaskKK 
<KK 
ActionResultKK &
<KK& '
ListKK' +
<KK+ ,
PistaDtoKK, 4
>KK4 5
>KK5 6
>KK6 7*
ObtenerTodosPistasDeAlbumAsyncKK8 V
(KKV W
GuidKKW [
AlbumIdKK\ c
)KKc d
{LL 	
tryMM 
{NN 
varOO 

pistasListOO 
=OO  
(OO! "
awaitOO" '"
_gestionarPistaServiceOO( >
.OO> ?%
ObtenerTodosPistasDeAlbumOO? X
(OOX Y
AlbumIdOOY `
)OO` a
)OOa b
.OOb c
SelectOOc i
(OOi j
itemOOj n
=>OOo q
itemOOr v
.OOv w
AsDtoOOw |
(OO| }
)OO} ~
)OO~ 
;	OO Ä
returnPP 

StatusCodePP !
(PP! "
$numPP" %
,PP% &

pistasListPP' 1
)PP1 2
;PP2 3
}QQ 
catchRR 
(RR 
	ExceptionRR 
errRR  
)RR  !
{SS 
returnTT 

StatusCodeTT !
(TT! "
$numTT" %
,TT% &
errTT' *
)TT* +
;TT+ ,
}UU 
}VV 	
[XX 	
HttpGetXX	 
(XX 
$strXX .
)XX. /
]XX/ 0
publicYY 
asyncYY 
TaskYY 
<YY 
ActionResultYY &
<YY& '
ListYY' +
<YY+ ,
PistaDtoYY, 4
>YY4 5
>YY5 6
>YY6 7-
!ObtenerTodosPistasDePlaylistAsyncYY8 Y
(YYY Z
GuidYYZ ^

PlaylistIdYY_ i
)YYi j
{ZZ 	
try[[ 
{\\ 
var]] 

pistasList]] 
=]]  
(]]! "
await]]" '"
_gestionarPistaService]]( >
.]]> ?(
ObtenerTodosPistasDePlaylist]]? [
(]][ \

PlaylistId]]\ f
)]]f g
)]]g h
.]]h i
Select]]i o
(]]o p
item]]p t
=>]]u w
item]]x |
.]]| }
AsDto	]]} Ç
(
]]Ç É
)
]]É Ñ
)
]]Ñ Ö
;
]]Ö Ü
return^^ 

StatusCode^^ !
(^^! "
$num^^" %
,^^% &

pistasList^^' 1
)^^1 2
;^^2 3
}__ 
catch`` 
(`` 
	Exception`` 
err``  
)``  !
{aa 
returnbb 

StatusCodebb !
(bb! "
$numbb" %
,bb% &
errbb' *
)bb* +
;bb+ ,
}cc 
}dd 	
[ff 	
HttpGetff	 
(ff 
$strff 
)ff 
]ff 
publicgg 
asyncgg 
Taskgg 
<gg 
ActionResultgg &
<gg& '
PistaDtogg' /
>gg/ 0
>gg0 1
ObtenerPistaAsyncgg2 C
(ggC D
GuidggD H
idggI K
)ggK L
{hh 	
tryii 
{jj 
varkk 
pistakk 
=kk 
awaitkk !"
_gestionarPistaServicekk" 8
.kk8 9
ObtenerPistakk9 E
(kkE F
idkkF H
)kkH I
;kkI J
ifll 
(ll 
pistall 
==ll 
nullll !
)ll! "
{mm 
returnnn 
NotFoundnn #
(nn# $
)nn$ %
;nn% &
}oo 
returnpp 

StatusCodepp !
(pp! "
$numpp" %
,pp% &
pistapp' ,
.pp, -
AsDtopp- 2
(pp2 3
)pp3 4
)pp4 5
;pp5 6
}qq 
catchrr 
(rr 
	Exceptionrr 
errrr  
)rr  !
{ss 
returntt 

StatusCodett !
(tt! "
$numtt" %
,tt% &
errtt' *
)tt* +
;tt+ ,
}uu 
}vv 	
[xx 	
HttpPutxx	 
]xx 
publicyy 
asyncyy 
Taskyy 
<yy 
ActionResultyy &
>yy& '
EditarPistaAsyncyy( 8
(yy8 9
Guidyy9 =
idyy> @
,yy@ A
EditarPistaDtoyyB P
pistaDtoyyQ Y
)yyY Z
{zz 	
try{{ 
{|| 
var}} 
pista}} 
=}} 
await}} !"
_gestionarPistaService}}" 8
.}}8 9
ObtenerPista}}9 E
(}}E F
id}}F H
)}}H I
;}}I J
if~~ 
(~~ 
pista~~ 
==~~ 
null~~ !
)~~! "
{ 
return
ÄÄ 
NotFound
ÄÄ #
(
ÄÄ# $
)
ÄÄ$ %
;
ÄÄ% &
}
ÅÅ 
Pista
ÇÇ 
pistaEditada
ÇÇ "
=
ÇÇ# $
pista
ÇÇ% *
with
ÇÇ+ /
{
ÉÉ 
Nombre
ÑÑ 
=
ÑÑ 
pistaDto
ÑÑ %
.
ÑÑ% &
Nombre
ÑÑ& ,
,
ÑÑ, -
AnoCreacion
ÖÖ 
=
ÖÖ  !
pistaDto
ÖÖ" *
.
ÖÖ* +
AnoCreacion
ÖÖ+ 6
,
ÖÖ6 7

Interprete
ÜÜ 
=
ÜÜ  
pistaDto
ÜÜ! )
.
ÜÜ) *

Interprete
ÜÜ* 4
,
ÜÜ4 5

Compositor
áá 
=
áá  
pistaDto
áá! )
.
áá) *

Compositor
áá* 4
,
áá4 5
	Productor
àà 
=
àà 
pistaDto
àà  (
.
àà( )
	Productor
àà) 2
,
àà2 3
GeneroId
ââ 
=
ââ 
pistaDto
ââ '
.
ââ' (
GeneroId
ââ( 0
,
ââ0 1
}
ää 
;
ää 
await
ãã $
_gestionarPistaService
ãã ,
.
ãã, -
EditarPista
ãã- 8
(
ãã8 9
pistaEditada
ãã9 E
)
ããE F
;
ããF G
return
åå 

StatusCode
åå !
(
åå! "
$num
åå" %
)
åå% &
;
åå& '
}
çç 
catch
éé 
(
éé 
	Exception
éé 
err
éé  
)
éé  !
{
èè 
return
êê 

StatusCode
êê !
(
êê! "
$num
êê" %
,
êê% &
err
êê' *
)
êê* +
;
êê+ ,
}
ëë 
}
íí 	
[
îî 	

HttpDelete
îî	 
(
îî 
$str
îî 
)
îî 
]
îî 
public
ïï 
async
ïï 
Task
ïï 
<
ïï 
ActionResult
ïï &
>
ïï& ' 
EliminarPistaAsync
ïï( :
(
ïï: ;
Guid
ïï; ?
id
ïï@ B
)
ïïB C
{
ññ 	
try
óó 
{
òò 
var
ôô 
pista
ôô 
=
ôô 
await
ôô !$
_gestionarPistaService
ôô" 8
.
ôô8 9
ObtenerPista
ôô9 E
(
ôôE F
id
ôôF H
)
ôôH I
;
ôôI J
if
öö 
(
öö 
pista
öö 
==
öö 
null
öö !
)
öö! "
{
õõ 
return
úú 
NotFound
úú #
(
úú# $
)
úú$ %
;
úú% &
}
ùù 
await
ûû $
_gestionarPistaService
ûû ,
.
ûû, -
EliminarPista
ûû- :
(
ûû: ;
id
ûû; =
)
ûû= >
;
ûû> ?
return
üü 

StatusCode
üü !
(
üü! "
$num
üü" %
)
üü% &
;
üü& '
}
†† 
catch
°° 
(
°° 
	Exception
°° 
err
°°  
)
°°  !
{
¢¢ 
return
££ 

StatusCode
££ !
(
££! "
$num
££" %
,
££% &
err
££' *
)
££* +
;
££+ ,
}
§§ 
}
•• 	
[
ßß 	
HttpGet
ßß	 
(
ßß 
$str
ßß 
)
ßß 
]
ßß 
public
®® 
async
®® 
Task
®® 
<
®® 
ActionResult
®® &
<
®®& '
List
®®' +
<
®®+ ,
PistaDto
®®, 4
>
®®4 5
>
®®5 6
>
®®6 7
SearchpistaAsync
®®8 H
(
®®H I
[
®®I J
Bind
®®J N
(
®®N O
Prefix
®®O U
=
®®V W
$str
®®X `
)
®®` a
]
®®a b
string
®®c i
cadena
®®j p
)
®®p q
{
©© 	
try
™™ 
{
´´ 
var
¨¨ 

pistaLista
¨¨ 
=
¨¨  
(
¨¨! "
await
¨¨" '$
_gestionarPistaService
¨¨( >
.
¨¨> ?
BuscarPistas
¨¨? K
(
¨¨K L
cadena
¨¨L R
)
¨¨R S
)
¨¨S T
.
¨¨T U
Select
¨¨U [
(
¨¨[ \
item
¨¨\ `
=>
¨¨a c
item
¨¨d h
.
¨¨h i
AsDto
¨¨i n
(
¨¨n o
)
¨¨o p
)
¨¨p q
;
¨¨q r
return
≠≠ 

StatusCode
≠≠ !
(
≠≠! "
$num
≠≠" %
,
≠≠% &

pistaLista
≠≠' 1
)
≠≠1 2
;
≠≠2 3
}
ÆÆ 
catch
ØØ 
(
ØØ 
	Exception
ØØ 
err
ØØ  
)
ØØ  !
{
∞∞ 
return
±± 

StatusCode
±± !
(
±±! "
$num
±±" %
,
±±% &
err
±±' *
)
±±* +
;
±±+ ,
}
≤≤ 
}
≥≥ 	
[
¥¥ 	
HttpPut
¥¥	 
(
¥¥ 
$str
¥¥ #
)
¥¥# $
]
¥¥$ %
public
µµ 
async
µµ 
Task
µµ 
<
µµ 
ActionResult
µµ &
>
µµ& '
ReproducirPista
µµ( 7
(
µµ7 8
Guid
µµ8 <
id
µµ= ?
)
µµ? @
{
∂∂ 	
try
∑∑ 
{
∏∏ 
var
ππ 
pista
ππ 
=
ππ 
await
ππ !$
_gestionarPistaService
ππ" 8
.
ππ8 9
ObtenerPista
ππ9 E
(
ππE F
id
ππF H
)
ππH I
;
ππI J
if
∫∫ 
(
∫∫ 
pista
∫∫ 
==
∫∫ 
null
∫∫  
)
∫∫  !
{
ªª 
return
ºº 
NotFound
ºº #
(
ºº# $
)
ºº$ %
;
ºº% &
}
ΩΩ 
await
ææ $
_gestionarPistaService
ææ ,
.
ææ, -
ReproducirPista
ææ- <
(
ææ< =
pista
ææ= B
)
ææB C
;
ææC D
return
øø 

StatusCode
øø !
(
øø! "
$num
øø" %
)
øø% &
;
øø& '
}
¿¿ 
catch
¡¡ 
(
¡¡ 
	Exception
¡¡ 
err
¡¡  
)
¡¡  !
{
¬¬ 
return
√√ 

StatusCode
√√ !
(
√√! "
$num
√√" %
,
√√% &
err
√√' *
)
√√* +
;
√√+ ,
}
ƒƒ 
}
≈≈ 	
}
»» 
}…… “n
fD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Controllers\PlaylistController.cs
	namespace 	
Antara
 
. 
API 
. 
Controllers  
{ 
[ 
Route 

(
 
$str 
) 
] 
[ 
ApiController 
] 
public 

class 
PlaylistController #
:$ %

Controller& 0
{ 
private 
readonly %
IGestionarPlaylistService 2%
_gestionarPlaylistService3 L
;L M
private 
const 
string 
directorioId )
=* +
$str, O
;O P
public 
PlaylistController !
(! "%
IGestionarPlaylistService" ;$
gestionarPlaylistService< T
)T U
{ 	%
_gestionarPlaylistService %
=& '$
gestionarPlaylistService( @
;@ A
} 	
[ 	
HttpPost	 
] 
public 
async 
Task 
< 
ActionResult &
<& '
PlaylistDto' 2
>2 3
>3 4
CrearPlaylistAsync5 G
(G H
[H I
FromFormI Q
]Q R
CrearAgrupacionDtoS e
crearPlaylistDtof v
,v w
[x y
FromForm	y Å
]
Å Ç
	IFormFile
É å
imagenDePortada
ç ú
)
ú ù
{ 	
try 
{ 
Playlist   
playlistNueva   &
=  ' (
new  ) ,
(  , -
)  - .
{!! 
Id"" 
="" 
Guid"" 
."" 
NewGuid"" %
(""% &
)""& '
,""' (
Nombre## 
=## 
crearPlaylistDto## -
.##- .
Nombre##. 4
,##4 5
Descripcion$$ 
=$$  !
crearPlaylistDto$$" 2
.$$2 3
Descripcion$$3 >
,$$> ?
	UsuarioId%% 
=%% 
crearPlaylistDto%%  0
.%%0 1
	UsuarioId%%1 :
,%%: ;

EstaActivo&& 
=&&  
true&&! %
}'' 
;'' 
if(( 
((( 
imagenDePortada(( #
==(($ &
null((' +
)((+ ,
{)) 
playlistNueva** !
.**! "

PortadaUrl**" ,
=**- .
null**/ 3
;**3 4
}++ 
else,, 
{-- 
string.. 
url.. 
=..  
await..! &

Extensions..' 1
...1 2
SubirArchivo..2 >
(..> ?
imagenDePortada..? N
,..N O
directorioId..P \
)..\ ]
;..] ^
playlistNueva// !
.//! "

PortadaUrl//" ,
=//- .
url/// 2
.//2 3
Replace//3 :
(//: ;
$str//; M
,//M N
$str//O Q
)//Q R
;//R S
}00 
await11 %
_gestionarPlaylistService11 /
.11/ 0
CrearPlaylist110 =
(11= >
playlistNueva11> K
)11K L
;11L M
return22 
CreatedAtAction22 &
(22& '
$str22' 8
,228 9
new22: =
{22> ?
id22@ B
=22C D
playlistNueva22E R
.22R S
Id22S U
}22V W
,22W X
playlistNueva22Y f
.22f g
AsDto22g l
(22l m
)22m n
)22n o
;22o p
}33 
catch44 
(44 
	Exception44 
err44  
)44  !
{55 
if66 
(66 
err66 
.66 
Message66 
.66  
Contains66  (
(66( )
$str66) ;
)66; <
)66< =
{77 
return88 

StatusCode88 %
(88% &
$num88& )
,88) *
Json88+ /
(88/ 0
new880 3
{884 5
error886 ;
=88< =
err88> A
.88A B
Message88B I
}88J K
)88K L
)88L M
;88M N
}99 
else:: 
return:: 

StatusCode:: &
(::& '
$num::' *
,::* +
err::, /
.::/ 0
Message::0 7
)::7 8
;::8 9
};; 
}<< 	
[>> 	
HttpGet>>	 
(>> 
$str>> 
)>> 
]>> 
public?? 
async?? 
Task?? 
<?? 
ActionResult?? &
<??& '
PlaylistDto??' 2
>??2 3
>??3 4 
ObtenerPlaylistAsync??5 I
(??I J
Guid??J N
id??O Q
)??Q R
{@@ 	
tryAA 
{BB 
varCC 
playlistCC 
=CC 
awaitCC $%
_gestionarPlaylistServiceCC% >
.CC> ?
ObtenerPlaylistCC? N
(CCN O
idCCO Q
)CCQ R
;CCR S
ifDD 
(DD 
playlistDD 
==DD 
nullDD  $
)DD$ %
{EE 
returnFF 
NotFoundFF #
(FF# $
)FF$ %
;FF% &
}GG 
returnHH 

StatusCodeHH !
(HH! "
$numHH" %
,HH% &
playlistHH' /
.HH/ 0
AsDtoHH0 5
(HH5 6
)HH6 7
)HH7 8
;HH8 9
}II 
catchJJ 
(JJ 
	ExceptionJJ 
errJJ  
)JJ  !
{KK 
returnLL 

StatusCodeLL !
(LL! "
$numLL" %
,LL% &
errLL' *
.LL* +
MessageLL+ 2
)LL2 3
;LL3 4
}MM 
}NN 	
[PP 	
HttpGetPP	 
(PP 
$strPP !
)PP! "
]PP" #
publicQQ 
asyncQQ 
TaskQQ 
<QQ 
ActionResultQQ &
<QQ& '
ListQQ' +
<QQ+ ,
PlaylistDtoQQ, 7
>QQ7 8
>QQ8 9
>QQ9 :.
"ObtenerTodosPlaylistDeUsuarioAsyncQQ; ]
(QQ] ^
GuidQQ^ b
userIdQQc i
)QQi j
{RR 	
trySS 
{TT 
varUU 
playlistListUU  
=UU! "
(UU# $
awaitUU$ )%
_gestionarPlaylistServiceUU* C
.UUC D)
ObtenerTodosPlaylistDeUsuarioUUD a
(UUa b
userIdUUb h
)UUh i
)UUi j
.UUj k
SelectUUk q
(UUq r
itemUUr v
=>UUw y
itemUUz ~
.UU~ 
AsDto	UU Ñ
(
UUÑ Ö
)
UUÖ Ü
)
UUÜ á
;
UUá à
returnVV 

StatusCodeVV !
(VV! "
$numVV" %
,VV% &
playlistListVV' 3
)VV3 4
;VV4 5
}WW 
catchXX 
(XX 
	ExceptionXX 
errXX  
)XX  !
{YY 
returnZZ 

StatusCodeZZ !
(ZZ! "
$numZZ" %
,ZZ% &
errZZ' *
.ZZ* +
MessageZZ+ 2
)ZZ2 3
;ZZ3 4
}[[ 
}\\ 	
[^^ 	
HttpPut^^	 
]^^ 
public__ 
async__ 
Task__ 
<__ 
ActionResult__ &
>__& '
EditarPlaylistAsync__( ;
(__; <
Guid__< @
id__A C
,__C D
EditarAgrupacionDto__E X
editarPlaylistDto__Y j
)__j k
{`` 	
tryaa 
{bb 
Playlistcc 
playlistcc !
=cc" #
awaitcc$ )%
_gestionarPlaylistServicecc* C
.ccC D
ObtenerPlaylistccD S
(ccS T
idccT V
)ccV W
;ccW X
ifdd 
(dd 
playlistdd 
==dd 
nulldd  $
)dd$ %
{ee 
returnff 
NotFoundff #
(ff# $
)ff$ %
;ff% &
}gg 
Playlisthh 
playlistEditadahh (
=hh) *
playlisthh+ 3
withhh4 8
{ii 
Nombrejj 
=jj 
editarPlaylistDtojj .
.jj. /
Nombrejj/ 5
,jj5 6
Descripcionkk 
=kk  !
editarPlaylistDtokk" 3
.kk3 4
Descripcionkk4 ?
,kk? @

PortadaUrlll 
=ll  
editarPlaylistDtoll! 2
.ll2 3

PortadaUrlll3 =
}mm 
;mm 
awaitnn %
_gestionarPlaylistServicenn /
.nn/ 0
EditarPlaylistnn0 >
(nn> ?
playlistEditadann? N
)nnN O
;nnO P
returnoo 

StatusCodeoo !
(oo! "
$numoo" %
)oo% &
;oo& '
}pp 
catchqq 
(qq 
	Exceptionqq 
errqq  
)qq  !
{rr 
returnss 

StatusCodess !
(ss! "
$numss" %
,ss% &
errss' *
.ss* +
Messagess+ 2
)ss2 3
;ss3 4
}tt 
}uu 	
[ww 	

HttpDeleteww	 
(ww 
$strww 
)ww 
]ww 
publicxx 
asyncxx 
Taskxx 
<xx 
ActionResultxx &
>xx& '!
EliminarPlaylistAsyncxx( =
(xx= >
Guidxx> B
idxxC E
)xxE F
{yy 	
tryzz 
{{{ 
var|| 
grupo|| 
=|| 
await|| !%
_gestionarPlaylistService||" ;
.||; <
ObtenerPlaylist||< K
(||K L
id||L N
)||N O
;||O P
if}} 
(}} 
grupo}} 
==}} 
null}} !
)}}! "
{~~ 
return 
NotFound #
(# $
)$ %
;% &
}
ÄÄ 
await
ÅÅ '
_gestionarPlaylistService
ÅÅ /
.
ÅÅ/ 0
EliminarPlaylist
ÅÅ0 @
(
ÅÅ@ A
id
ÅÅA C
)
ÅÅC D
;
ÅÅD E
return
ÇÇ 

StatusCode
ÇÇ !
(
ÇÇ! "
$num
ÇÇ" %
)
ÇÇ% &
;
ÇÇ& '
}
ÉÉ 
catch
ÑÑ 
(
ÑÑ 
	Exception
ÑÑ 
err
ÑÑ  
)
ÑÑ  !
{
ÖÖ 
return
ÜÜ 

StatusCode
ÜÜ !
(
ÜÜ! "
$num
ÜÜ" %
,
ÜÜ% &
err
ÜÜ' *
.
ÜÜ* +
Message
ÜÜ+ 2
)
ÜÜ2 3
;
ÜÜ3 4
}
áá 
}
àà 	
[
ää 	
HttpPost
ää	 
(
ää 
$str
ää 
)
ää 
]
ää 
public
ãã 
async
ãã 
Task
ãã 
<
ãã 
ActionResult
ãã &
>
ãã& '(
AgregarPistaAPlaylistAsync
ãã( B
(
ããB C
PlaylistPista
ããC P
playlistPista
ããQ ^
)
ãã^ _
{
åå 	
try
çç 
{
éé 
var
êê 
playlist
êê 
=
êê 
await
êê $'
_gestionarPlaylistService
êê% >
.
êê> ?
ObtenerPlaylist
êê? N
(
êêN O
playlistPista
êêO \
.
êê\ ]

PlaylistId
êê] g
)
êêg h
;
êêh i
if
ëë 
(
ëë 
playlist
ëë 
==
ëë 
null
ëë  $
)
ëë$ %
{
íí 
return
ìì 
NotFound
ìì #
(
ìì# $
playlistPista
ìì$ 1
.
ìì1 2

PlaylistId
ìì2 <
)
ìì< =
;
ìì= >
}
îî 
await
ïï '
_gestionarPlaylistService
ïï /
.
ïï/ 0#
AgregarPistaAPlaylist
ïï0 E
(
ïïE F
playlistPista
ïïF S
)
ïïS T
;
ïïT U
return
ññ 

StatusCode
ññ !
(
ññ! "
$num
ññ" %
)
ññ% &
;
ññ& '
}
óó 
catch
òò 
(
òò 
	Exception
òò 
err
òò  
)
òò  !
{
ôô 
return
öö 

StatusCode
öö !
(
öö! "
$num
öö" %
,
öö% &
err
öö' *
.
öö* +
Message
öö+ 2
)
öö2 3
;
öö3 4
}
õõ 
}
úú 	
[
ûû 	

HttpDelete
ûû	 
(
ûû 
$str
ûû 
)
ûû 
]
ûû 
public
üü 
async
üü 
Task
üü 
<
üü 
ActionResult
üü &
>
üü& '(
QuitarPistaDePlaylistAsync
üü( B
(
üüB C
PlaylistPista
üüC P
playlistPista
üüQ ^
)
üü^ _
{
†† 	
try
°° 
{
¢¢ 
var
££ 
grupo
££ 
=
££ 
await
££ !'
_gestionarPlaylistService
££" ;
.
££; <
ObtenerPlaylist
££< K
(
££K L
playlistPista
££L Y
.
££Y Z

PlaylistId
££Z d
)
££d e
;
££e f
if
§§ 
(
§§ 
grupo
§§ 
==
§§ 
null
§§ !
)
§§! "
{
•• 
return
¶¶ 
NotFound
¶¶ #
(
¶¶# $
playlistPista
¶¶$ 1
.
¶¶1 2

PlaylistId
¶¶2 <
)
¶¶< =
;
¶¶= >
}
ßß 
await
®® '
_gestionarPlaylistService
®® /
.
®®/ 0#
QuitarPistaDePlaylist
®®0 E
(
®®E F
playlistPista
®®F S
)
®®S T
;
®®T U
return
©© 

StatusCode
©© !
(
©©! "
$num
©©" %
)
©©% &
;
©©& '
}
™™ 
catch
´´ 
(
´´ 
	Exception
´´ 
err
´´  
)
´´  !
{
¨¨ 
return
≠≠ 

StatusCode
≠≠ !
(
≠≠! "
$num
≠≠" %
,
≠≠% &
err
≠≠' *
.
≠≠* +
Message
≠≠+ 2
)
≠≠2 3
;
≠≠3 4
}
ÆÆ 
}
ØØ 	
}
∞∞ 
}±± ÍF
eD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Controllers\UsuarioController.cs
	namespace 	
Antara
 
. 
API 
. 
Controllers  
{ 
[ 
Route 

(
 
$str 
) 
] 
[ 
ApiController 
] 
public 

class 
UsuarioController "
:# $

Controller% /
{ 
private 
readonly $
IRegistrarUsuarioService 1$
_registrarUsuarioService2 J
;J K
private 
readonly 
ILoginService &
_loginService' 4
;4 5
private 
const 
string 
directorioId )
=* +
$str, O
;O P
public 
UsuarioController  
(  !$
IRegistrarUsuarioService! 9#
registrarUsuarioService: Q
,Q R
ILoginServiceS `
loginServicea m
)m n
{ 	$
_registrarUsuarioService $
=% &#
registrarUsuarioService' >
;> ?
_loginService 
= 
loginService (
;( )
} 	
[ 	
HttpPost	 
] 
public 
async 
Task 
< 
ActionResult &
<& '

UsuarioDto' 1
>1 2
>2 3
CrearUsuarioAsync4 E
(E F
[F G
FromFormG O
]O P
CrearUsuarioDtoQ `

usuarioDtoa k
,k l
[m n
FromFormn v
]v w
	IFormFile	x Å

fotoPerfil
Ç å
)
å ç
{ 	
try 
{   
Usuario!! 
usuarioNuevo!! $
=!!% &
new!!' *
(!!* +
)!!+ ,
{"" 
Id## 
=## 
Guid## 
.## 
NewGuid## %
(##% &
)##& '
,##' (
Email$$ 
=$$ 

usuarioDto$$ &
.$$& '
Email$$' ,
,$$, -
Password%% 
=%% 

usuarioDto%% )
.%%) *
Password%%* 2
,%%2 3
Nombre&& 
=&& 

usuarioDto&& '
.&&' (
Nombre&&( .
,&&. /
FechaNacimiento'' #
=''$ %

usuarioDto''& 0
.''0 1
FechaNacimiento''1 @
,''@ A
Genero(( 
=(( 

usuarioDto(( '
.((' (
Genero((( .
,((. /

EstaActivo)) 
=))  
true))! %
,))% &
FechaRegistro** !
=**" #
DateTime**$ ,
.**, -
Now**- 0
,**0 1
Pais++ 
=++ 

usuarioDto++ %
.++% &
Pais++& *
,++* +
Tipo,, 
=,, 

usuarioDto,, %
.,,% &
Tipo,,& *
}-- 
;-- 
if.. 
(.. 

fotoPerfil.. 
==.. !
null.." &
)..& '
{// 
usuarioNuevo00  
.00  !

FotoPerfil00! +
=00, -
null00. 2
;002 3
}11 
else22 
{33 
string44 
url44 
=44  
await44! &

Extensions44' 1
.441 2
SubirArchivo442 >
(44> ?

fotoPerfil44? I
,44I J
directorioId44K W
)44W X
;44X Y
usuarioNuevo55  
.55  !

FotoPerfil55! +
=55, -
url55. 1
.551 2
Replace552 9
(559 :
$str55: L
,55L M
$str55N P
)55P Q
;55Q R
}66 
await77 $
_registrarUsuarioService77 .
.77. /
CrearUsuario77/ ;
(77; <
usuarioNuevo77< H
)77H I
;77I J
return88 
CreatedAtAction88 &
(88& '
$str88' 7
,887 8
new889 <
{88= >
id88? A
=88B C
usuarioNuevo88D P
.88P Q
Id88Q S
}88T U
,88U V
usuarioNuevo88W c
.88c d
AsDto88d i
(88i j
)88j k
)88k l
;88l m
}99 
catch:: 
(:: 
	Exception:: 
err::  
)::  !
{;; 
if<< 
(<< 
err<< 
.<< 
Message<< 
.<<  
Contains<<  (
(<<( )
$str<<) E
)<<E F
||== 
err== 
.== 
Message== "
.==" #
Contains==# +
(==+ ,
$str==, I
)==I J
)==J K
{>> 
return?? 

StatusCode?? %
(??% &
$num??& )
,??) *
Json??+ /
(??/ 0
new??0 3
{??4 5
error??6 ;
=??< =
err??> A
.??A B
Message??B I
}??J K
)??K L
)??L M
;??M N
}@@ 
elseAA 
returnAA 

StatusCodeAA &
(AA& '
$numAA' *
,AA* +
errAA, /
.AA/ 0
MessageAA0 7
)AA7 8
;AA8 9
}BB 
}CC 	
[FF 	
HttpGetFF	 
(FF 
$strFF 
)FF 
]FF 
publicGG 
asyncGG 
TaskGG 
<GG 
ActionResultGG &
<GG& '

UsuarioDtoGG' 1
>GG1 2
>GG2 3
ObtenerUsuarioAsyncGG4 G
(GGG H
GuidGGH L
idGGM O
)GGO P
{HH 	
tryII 
{JJ 
UsuarioKK 
usuarioKK 
=KK  !
awaitKK" '$
_registrarUsuarioServiceKK( @
.KK@ A
ObtenerUsuarioKKA O
(KKO P
idKKP R
)KKR S
;KKS T
ifLL 
(LL 
usuarioLL 
==LL 
nullLL #
)LL# $
returnMM 
NotFoundMM #
(MM# $
)MM$ %
;MM% &
returnNN 

StatusCodeNN !
(NN! "
$numNN" %
,NN% &
usuarioNN' .
.NN. /
AsDtoNN/ 4
(NN4 5
)NN5 6
)NN6 7
;NN7 8
}OO 
catchPP 
(PP 
	ExceptionPP 
errPP  
)PP  !
{QQ 
returnRR 

StatusCodeRR !
(RR! "
$numRR" %
,RR% &
errRR' *
.RR* +
MessageRR+ 2
)RR2 3
;RR3 4
}SS 
}TT 	
[WW 	
HttpPostWW	 
]WW 
[XX 	
RouteXX	 
(XX 
$strXX 
)XX 
]XX 
publicYY 
asyncYY 
TaskYY 
<YY 
ActionResultYY &
>YY& '

LoginAsyncYY( 2
(YY2 3
[YY3 4
FromBodyYY4 <
]YY< =
LoginUsuarioDtoYY> M
loginDtoYYN V
)YYV W
{ZZ 	
try[[ 
{\\ 
Usuario]] 
usuario]] 
=]]  !
await]]" '
_loginService]]( 5
.]]5 6
Login]]6 ;
(]]; <
loginDto]]< D
.]]D E
Email]]E J
,]]J K
loginDto]]L T
.]]T U
Password]]U ]
)]]] ^
;]]^ _
if^^ 
(^^ 
usuario^^ 
==^^ 
null^^ "
)^^" #
{__ 
return`` 
NotFound`` #
(``# $
)``$ %
;``% &
}aa 
returnbb 
Jsonbb 
(bb 
newbb 
{bb  !
usuariobb" )
.bb) *
Emailbb* /
,bb/ 0
usuariobb1 8
.bb8 9
Nombrebb9 ?
,bb? @
usuariobbA H
.bbH I
FechaNacimientobbI X
,bbX Y
usuariobbZ a
.bba b
Generobbb h
,bbh i
usuariobbj q
.bbq r
FechaRegistrobbr 
,	bb Ä
usuario
bbÅ à
.
bbà â
Pais
bbâ ç
}
bbé è
)
bbè ê
;
bbê ë
}cc 
catchdd 
(dd 
	Exceptiondd 
errdd  
)dd  !
{ee 
ifff 
(ff 
errff 
.ff 
Messageff 
.ff 
Containsff '
(ff' (
$strff( <
)ff< =
)ff= >
{ff> ?
returngg 

StatusCodegg %
(gg% &
$numgg& )
,gg) *
Jsongg+ /
(gg/ 0
newgg0 3
{gg4 5
errorgg6 ;
=gg< =
errgg> A
.ggA B
MessageggB I
}ggJ K
)ggK L
)ggL M
;ggM N
}hh 
throwii 
;ii 
}jj 
}kk 	
}ll 
}mm ¸ 
RD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Extensions.cs
	namespace 	
Antara
 
. 
API 
{ 
public 

abstract 
class 

Extensions $
:% &

Controller' 1
{ 
public 
static 
async 
Task  
<  !
string! '
>' (
SubirArchivo) 5
(5 6
	IFormFile6 ?
archivo@ G
,G H
stringI O
directorioIdP \
,\ ]
string^ d
contentTypee p
=q r
$strs 
)	 Ä
{ 	
string "
credencialesDirectorio )
=* +
Path, 0
.0 1
Combine1 8
(8 9
	Directory9 B
.B C
GetCurrentDirectoryC V
(V W
)W X
,X Y
$strZ m
)m n
;n o
var 

credential 
= 
GoogleCredential -
.- .
FromFile. 6
(6 7"
credencialesDirectorio7 M
)M N
. 
CreateScoped 
( 
DriveService *
.* +
ScopeConstants+ 9
.9 :
Drive: ?
)? @
;@ A
var 
service 
= 
new 
DriveService *
(* +
new+ .
BaseClientService/ @
.@ A
InitializerA L
(L M
)M N
{ !
HttpClientInitializer %
=& '

credential( 2
} 
) 
; 
var   
fileMetadata   
=   
new   "
Google  # )
.  ) *
Apis  * .
.  . /
Drive  / 4
.  4 5
v3  5 7
.  7 8
Data  8 <
.  < =
File  = A
(  A B
)  B C
{!! 
Name"" 
="" 
archivo"" 
."" 
FileName"" '
,""' (
Parents## 
=## 
new## 
List## "
<##" #
String### )
>##) *
(##* +
)##+ ,
{##- .
directorioId##/ ;
}##< =
}$$ 
;$$ 
string%% 
fileUrl%% 
;%% 
await'' 
using'' 
('' 
var'' 
fsSource'' %
=''& '
new''( +
MemoryStream'', 8
(''8 9
)''9 :
)'': ;
{(( 
await** 
archivo** 
.** 
CopyToAsync** )
(**) *
fsSource*** 2
)**2 3
;**3 4
var++ 
request++ 
=++ 
service++ %
.++% &
Files++& +
.+++ ,
Create++, 2
(++2 3
fileMetadata++3 ?
,++? @
fsSource++A I
,++I J
contentType++K V
)++V W
;++W X
request,, 
.,, 
Fields,, 
=,,  
$str,,! $
;,,$ %
var-- 
results-- 
=-- 
await-- #
request--$ +
.--+ ,
UploadAsync--, 7
(--7 8
CancellationToken--8 I
.--I J
None--J N
)--N O
;--O P
if.. 
(.. 
results.. 
... 
Status.. "
==..# %
UploadStatus..& 2
...2 3
Failed..3 9
)..9 :
{// 
Console00 
.00 
	WriteLine00 %
(00% &
$"00& (
$str00( C
{00C D
results00D K
.00K L
	Exception00L U
.00U V
Message00V ]
}00] ^
"00^ _
)00_ `
;00` a
}11 
fileUrl22 
=22 
request22 !
.22! "
ResponseBody22" .
?22. /
.22/ 0
WebContentLink220 >
;22> ?
}33 
return44 
fileUrl44 
;44 
}55 	
}66 
}77 ◊

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
} …3
OD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.API\Startup.cs
	namespace 	
Antara
 
. 
API 
{ 
public 

class 
Startup 
{ 
public 
Startup 
( 
IConfiguration %
configuration& 3
)3 4
{ 	
Configuration 
= 
configuration )
;) *
} 	
public 
IConfiguration 
Configuration +
{, -
get. 1
;1 2
}3 4
public 
void 
ConfigureServices %
(% &
IServiceCollection& 8
services9 A
)A B
{ 	
services 
. 
AddControllers #
(# $
)$ %
;% &
services 
. 

AddOptions 
(  
)  !
;! "
services   
.   
	Configure   
<   
AppSettings   *
>  * +
(  + ,
Configuration  , 9
.  9 :

GetSection  : D
(  D E
$str  E R
)  R S
)  S T
;  T U
services!! 
.!! 
AddTransient!! !
<!!! "
IDapper!!" )
,!!) *
Antara!!+ 1
.!!1 2

Repository!!2 <
.!!< =
Dapper!!= C
.!!C D
Dapper!!D J
>!!J K
(!!K L
)!!L M
;!!M N
services"" 
."" 
AddTransient"" !
<""! "
IUsuarioRepository""" 4
,""4 5
UsuarioRepository""6 G
>""G H
(""H I
)""I J
;""J K
services## 
.## 
AddTransient## !
<##! "
IPistaRepository##" 2
,##2 3
PistaRepository##4 C
>##C D
(##D E
)##E F
;##F G
services$$ 
.$$ 
AddTransient$$ !
<$$! "
IAlbumRepository$$" 2
,$$2 3
AlbumRepository$$4 C
>$$C D
($$D E
)$$E F
;$$F G
services%% 
.%% 
AddTransient%% !
<%%! "
IPlaylistRepository%%" 5
,%%5 6
PlaylistRepository%%7 I
>%%I J
(%%J K
)%%K L
;%%L M
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
<((! ""
IGestionarPistaService((" 8
,((8 9!
GestionarPistaService((: O
>((O P
(((P Q
)((Q R
;((R S
services)) 
.)) 
AddTransient)) !
<))! ""
IGestionarAlbumService))" 8
,))8 9!
GestionarAlbumService)): O
>))O P
())P Q
)))Q R
;))R S
services** 
.** 
AddTransient** !
<**! "%
IGestionarPlaylistService**" ;
,**; <$
GestionarPlaylistService**= U
>**U V
(**V W
)**W X
;**X Y
services++ 
.++ 
AddTransient++ !
<++! "
IEncryptText++" .
,++. /
EncryptText++0 ;
>++; <
(++< =
)++= >
;++> ?
services-- 
.-- 
AddCors-- 
(-- 
options-- $
=>--% '
{.. 
options// 
.// 
	AddPolicy// !
(//! "
$str//" 7
,//7 8
builder00 
=>00 
builder00 &
.00& '
AllowAnyMethod00' 5
(005 6
)006 7
.007 8
AllowAnyHeader008 F
(00F G
)00G H
.00H I
AllowAnyOrigin00I W
(00W X
)00X Y
)00Y Z
;00Z [
}11 
)11 
;11 
services33 
.33 
AddSwaggerGen33 "
(33" #
c33# $
=>33% '
{44 
c55 
.55 

SwaggerDoc55 
(55 
$str55 !
,55! "
new55# &
OpenApiInfo55' 2
{553 4
Title555 :
=55; <
$str55= H
,55H I
Version55J Q
=55R S
$str55T X
}55Y Z
)55Z [
;55[ \
}66 
)66 
;66 
}99 	
public;; 
void;; 
	Configure;; 
(;; 
IApplicationBuilder;; 1
app;;2 5
,;;5 6
IWebHostEnvironment;;7 J
env;;K N
);;N O
{<< 	
if== 
(== 
env== 
.== 
IsDevelopment== !
(==! "
)==" #
)==# $
{>> 
app?? 
.?? %
UseDeveloperExceptionPage?? -
(??- .
)??. /
;??/ 0
app@@ 
.@@ 

UseSwagger@@ 
(@@ 
)@@  
;@@  !
appAA 
.AA 
UseSwaggerUIAA  
(AA  !
cAA! "
=>AA# %
cAA& '
.AA' (
SwaggerEndpointAA( 7
(AA7 8
$strAA8 R
,AAR S
$strAAT b
)AAb c
)AAc d
;AAd e
}BB 
appCC 
.CC 
UseCorsCC 
(CC 
$strCC %
)CC% &
;CC& '
appFF 
.FF 
UseHttpsRedirectionFF #
(FF# $
)FF$ %
;FF% &
appHH 
.HH 

UseRoutingHH 
(HH 
)HH 
;HH 
appJJ 
.JJ 
UseAuthorizationJJ  
(JJ  !
)JJ! "
;JJ" #
appLL 
.LL 
UseCorsLL 
(LL 
$strLL -
)LL- .
;LL. /
appNN 
.NN 
UseEndpointsNN 
(NN 
	endpointsNN &
=>NN' )
{OO 
	endpointsPP 
.PP 
MapControllersPP (
(PP( )
)PP) *
;PP* +
}QQ 
)QQ 
;QQ 
}RR 	
}SS 
}TT 