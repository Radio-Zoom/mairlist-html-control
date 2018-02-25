<?PHP
/**
 * this is the general file any request should be routed through
 *
 * @package     
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Malte Schroeder <post@malte-schroeder.de>
 * @copyright   Copyright (c) 2017-2018 Malte Schroeder (http://www.malte-schroeder.de)
 *
 */
 
// Configurattion Block
$mairlistserver = 'mairlistserver.domain.de';  // ip oder hostname Deines mAirList Rechners
$mairlistrestport = '9300';  //  Der Port Deiner REST Schnittstelle, default 9300
$mairlistuser = 'mAirlistRestUser';  // Der Benutzername für Deinen REST User
$mairlistpass = 'Supergeheimes-Passwort-0815';  // Das Passwort für Deinen REST User
// Configurattion Block End
// ab hier nur noch ändern, wenn Du weißt, was Du tust.
ini_set('default_socket_timeout', 2); // kein Response in 2 Sekunden, dann ist irgendwas fürchterlich falsch gelaufen.

if (isset($_GET['read'])) 
	{
		$read = ($_GET['read']);
		$json = file_get_contents('http://'.$mairlistuser.':'.$mairlistpass.'@'.$mairlistserver.':'.$mairlistrestport.$read);
		header('Content-Type: application/json');
		header("Access-Control-Allow-Origin: *");
		echo $json;
	}
else if (isset($_POST)) 
		{
		postrest($mairlistserver, $mairlistrestport, $mairlistuser, $mairlistpass, $_POST['command']);
		header("Access-Control-Allow-Origin: *");	
}

	
	

// POST function to pass commands to mAirList. 
	
	
function postrest($server, $port, $user, $pass, $execcommand)
{		
		$fp = curl_init($server.':'.$port.'/execute');
		curl_setopt($fp,CURLOPT_TIMEOUT,2);
		curl_setopt($fp,CURLOPT_FAILONERROR,0);
		curl_setopt($fp,CURLOPT_RETURNTRANSFER,1);
		curl_setopt($fp,CURLOPT_HTTPAUTH, CURLAUTH_BASIC); 
		curl_setopt($fp,CURLOPT_USERPWD, $user.':'.$pass); 
		curl_setopt($fp,CURLOPT_POST, 1); 
		curl_setopt($fp,CURLOPT_POSTFIELDS, 'command='.urlencode($execcommand));
		curl_exec($fp);
		echo $_POST['command'];
		if (curl_errno($fp) != 0)  
		{ 
			echo $mairlistserver['status'] = false;
		} 
		else  
		{ 
			$mairlistserver['status'] = true;
		} 
		curl_close($fp);
}	
	
	
?>
