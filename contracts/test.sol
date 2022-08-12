// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract VerifySig {

    function verify(address _signer, string memory _mesessage, bytes memory _sign) 
        external 
        pure 
        returns (bool)
    {
        bytes32 messageHash = getMessageHash(_mesessage);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recover(ethSignedMessageHash, _sign) == _signer;
    }

    function getMessageHash(string memory _mesessage) public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(_mesessage));
    }

    function getEthSignedMessageHash(bytes32 _messageHash) 
        public 
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n",
            _messageHash
        ));
    }

    function recover(bytes32 _ethSignedMessageHash, bytes memory _sign) 
        public pure returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = _split(_sign);
        return(ecrecover(_ethSignedMessageHash, v,r,s));
    }

    function _split(bytes memory _sign) internal pure returns (bytes32 r, bytes32 s, uint8 v){
        require(_sign.length == 65, "Invalid sign");
        assembly{
            r := mload(add(_sign,32))
            s := mload(add(_sign,64))
            v := byte(0, mload(add(_sign, 96)))
        }
    }


}