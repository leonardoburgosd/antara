û
XD:\UPN\9no\CAPSTONE\Proyecto\AntaraSoft\antara\AntaraSoft\Antara.Security\EncryptText.cs
	namespace 	
Antara
 
. 
Security 
{ 
public 

	interface 
IEncryptText !
{ 
string  
GeneratePasswordHash #
(# $
string$ *
texto+ 0
)0 1
;1 2
Boolean 
CompararHash 
( 
string #
textoNoEncriptado$ 5
,5 6
string7 =
textoEncriptado> M
)M N
;N O
}		 
public

 

class

 
EncryptText

 
:

 
IEncryptText

 *
{ 
public 
bool 
CompararHash  
(  !
string! '
textoNoEncriptado( 9
,9 :
string; A
textoEncriptadoB Q
)Q R
{ 	
return 
	BCryptNet 
. 
Verify #
(# $
textoNoEncriptado$ 5
,5 6
textoEncriptado7 F
)F G
;G H
} 	
public 
string  
GeneratePasswordHash *
(* +
string+ 1
texto2 7
)7 8
{ 	
return 
	BCryptNet 
. 
HashPassword )
() *
texto* /
)/ 0
;0 1
} 	
} 
} 