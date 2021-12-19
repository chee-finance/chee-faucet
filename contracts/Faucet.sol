pragma solidity 0.5.17;

import "./IERC20.sol";
import "./AddressHelper.sol";

contract Faucet {
    using AddressHelper for address;

    mapping(address => uint256) public withdrawAuth;
    uint256 public period = 8400;

    IERC20[] public tokens;
    mapping(address => uint256) public tokensInfo;

    address public admin;

    constructor() public {
        admin = msg.sender;
    }

    function withdraw() public {
        require(msg.sender == tx.origin, "do not withdraw from contract");

        uint256 start = withdrawAuth[msg.sender];
        require(start + period < block.number, "Please wait");

        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 per = tokensInfo[address(tokens[i])];
            if (per > 0) {
                if (tokens[i].balanceOf(address(this)) >= per) {
                    address token = address(tokens[i]);
                    address(tokens[i]).safeTransfer(msg.sender, per);

                    emit Withdraw(
                        msg.sender,
                        token,
                        tokensInfo[address(tokens[i])]
                    );
                }
            }
        }
        withdrawAuth[msg.sender] = block.number;
    }

    function setPer(address _token, uint256 _per) public onlyAdmin {
        require(tokensInfo[_token] > 0, "Not exist");
        tokensInfo[_token] = _per;
    }

    function addToken(IERC20 _token, uint256 _per) public onlyAdmin {
        require(tokensInfo[address(_token)] == 0, "Token exists");
        require(_per > 0, "per > 0");
        uint256 index = tokens.length++;
        tokens[index] = _token;
        tokensInfo[address(_token)] = _per;
        emit AddToken(address(_token), _per);
    }

    function setPeriod(uint256 _period) public onlyAdmin {
        period = _period;
        emit SetPeriod(_period);
    }

    function removeToken(IERC20 _token) public onlyAdmin {
        IERC20[] memory _tokens = tokens;
        for (uint256 i = 0; i < _tokens.length; i++) {
            if (address(_tokens[i]) == address(_token)) {
                tokens[i] = tokens[_tokens.length - 1];
                delete tokens[_tokens.length - 1];
                delete tokensInfo[address(_token)];
                uint256 balance = _token.balanceOf(address(this));
                if (balance > 0) {
                    address(_token).safeTransfer(
                        admin,
                        _token.balanceOf(address(this))
                    );
                }
                emit RemoveToken(address(_token));
                break;
            }
        }
    }

    function tokensLength() public view returns (uint256) {
        return tokens.length;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not Authorized, Only Admin");
        _;
    }

    event AddToken(address _token, uint256 _per);

    event SetPer(address _token, uint256 _per);

    event Withdraw(address withdrawer, address token, uint256 amount);

    event RemoveToken(address _token);

    event SetPeriod(uint256 _period);
}
