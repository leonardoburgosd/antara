Ð
XD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.Service\LoginService.cs
	namespace 	
Antara
 
. 
Service 
{ 
public 

class 
LoginService 
: 
ILoginService +
{ 
private 
readonly 
IUsuarioRepository +
usuarioRepo, 7
;7 8
private 
readonly 
IEncryptText %
encryptText& 1
;1 2
public 
LoginService 
( 
IUsuarioRepository .
usuarioRepo/ :
,: ;
IEncryptText< H
encryptTextI T
)T U
{ 	
this 
. 
usuarioRepo 
= 
usuarioRepo *
;* +
this 
. 
encryptText 
= 
encryptText *
;* +
} 	
public 
async 
Task 
< 
Usuario !
>! "
Login# (
(( )
string) /
email0 5
,5 6
string7 =
password> F
)F G
{ 	
try 
{ 
Usuario 
user 
= 
await $
usuarioRepo% 0
.0 1
Login1 6
(6 7
email7 <
)< =
;= >
if 
( 
user 
!= 
null  
)  !
{ 
if 
( 
encryptText #
.# $
CompararHash$ 0
(0 1
password1 9
,9 :
user; ?
.? @
Password@ H
)H I
)I J
returnK Q
userR V
;V W
else 
throw 
new "
ArgumentException# 4
(4 5
$str5 c
)c d
;d e
}   
else   
throw   
new   
ArgumentException    1
(  1 2
$str  2 U
)  U V
;  V W
}"" 
catch## 
(## 
	Exception## 
e## 
)## 
{$$ 
Console%% 
.%% 
Write%% 
(%% 
e%% 
)%%  
;%%  !
throw&& 
;&& 
}'' 
}(( 	
})) 
}** Ë
cD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.Service\RegistrarUsuarioService.cs
	namespace

 	
Antara


 
.

 
Service

 
{ 
public 

class #
RegistrarUsuarioService (
:) *$
IRegistrarUsuarioService+ C
{ 
private 
readonly 
IUsuarioRepository +
usuarioRepo, 7
;7 8
private 
readonly 
IEncryptText %
encryptText& 1
;1 2
public #
RegistrarUsuarioService &
(& '
IUsuarioRepository' 9
usuarioRepo: E
,E F
IEncryptTextG S
encryptTextT _
)_ `
{ 	
this 
. 
usuarioRepo 
= 
usuarioRepo *
;* +
this 
. 
encryptText 
= 
encryptText *
;* +
} 	
public 
async 
Task 
< 
Usuario !
>! "
CreateUsuario# 0
(0 1
Usuario1 8
usuario9 @
)@ A
{ 	
try 
{ 
usuario 
. 
Password  
=! "
encryptText# .
.. / 
GeneratePasswordHash/ C
(C D
usuarioD K
.K L
PasswordL T
)T U
;U V
usuario 
= 
await 
usuarioRepo  +
.+ ,
CreateUsuario, 9
(9 :
usuario: A
)A B
;B C
return 
usuario 
; 
} 
catch 
( 
	Exception 
err  
)  !
{   
Console!! 
.!! 
Write!! 
(!! 
err!! !
)!!! "
;!!" #
throw"" 
;"" 
}## 
}$$ 	
public'' 
async'' 
Task'' 
<'' 
Usuario'' !
>''! "

GetUsuario''# -
(''- .
long''. 2
id''3 5
)''5 6
{(( 	
try)) 
{** 
return++ 
await++ 
usuarioRepo++ (
.++( )

GetUsuario++) 3
(++3 4
id++4 6
)++6 7
;++7 8
},, 
catch-- 
(-- 
	Exception-- 
err--  
)--  !
{.. 
Console// 
.// 
Write// 
(// 
err// !
)//! "
;//" #
throw00 
;00 
}11 
}22 	
public44 
async44 
Task44 
<44 
Boolean44 !
>44! "
IsEmailValid44# /
(44/ 0
string440 6
email447 <
)44< =
{55 	
try66 
{77 
return88 
await88 
usuarioRepo88 (
.88( )
CheckUniqueEmail88) 9
(889 :
email88: ?
)88? @
;88@ A
}99 
catch:: 
(:: 
	Exception:: 
err::  
)::  !
{;; 
Console<< 
.<< 
Write<< 
(<< 
err<< !
)<<! "
;<<" #
throw== 
;== 
}>> 
}?? 	
}@@ 
}AA 