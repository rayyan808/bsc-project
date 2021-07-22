class TallyVotes extends Component {
    /* ==================================== INITIALIZATION ==================================================*/
    constructor(props){
        super(props);
        this.state={
        
      };
        this.handleChange = this.handleChange.bind(this);
        this.handleSecretKey = this.handleSecretKey.bind(this);
                      /* Candidates */
        this.handleCandidateLabel = this.handleCandidateLabel.bind(this);
        this.getCandidates = this.getCandidates.bind(this);
                      /* Accounts */
        this.displayAccountlist = this.displayAccountlist.bind(this);
        this.handleAccountChange = this.handleAccountChange.bind(this);
        this.getAccounts = this.getAccounts.bind(this);
                    /* Zokrates File MGMT */
        this.generateProof = this.generateProof.bind(this);
        this.getProvingKey = this.getProvingKey.bind(this);
        this.getZokFile = this.getZokFile.bind(this);
        this.compileZok = this.compileZok.bind(this);
            /* Initialization Second Phase */
        this.getAccounts();
        iniZokrates();
    }
render() {
    
    return (
  <div>          
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />
  <title>DApp</title>
  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Alfa+Slab+One" />
  <link rel="stylesheet" href="assets/fonts/ionicons.min.css" />
  <link rel="stylesheet" href="assets/css/Login-Form-Dark.css" />
  <link rel="stylesheet" href="assets/css/styles.css" />
  <section className="login-dark">
    <nav className="navbar navbar-light navbar-expand-md">
      <div className="container-fluid"><a className="navbar-brand link-light" href="#" style={{color: 'var(--bs-yellow)', fontFamily: '"Alfa Slab One", serif'}}>&nbsp; NFT AUCTION</a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon" /></button>
        <div className="collapse navbar-collapse" id="navcol-1">
          <ul className="navbar-nav">
            <li className="nav-item"><a className="nav-link active" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}><Link to="/conductElection">Conduct Election</Link></a></li>
            <li className="nav-item"><a className="nav-link" style={{color: 'var(--bs-yellow)', fontFamily: '"Alfa Slab One", serif'}}><Link to="/generateVoteKey">Generate Vote Key</Link></a></li>
            <li className="nav-item"><a className="nav-link" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}><Link to="/submitVote">Submit Vote</Link></a></li>
            <li className="nav-item" />
          </ul>
        </div>
      </div>
    </nav>
    <form method="post" id="conductElectionForm">
      <h2 className="visually-hidden">Election Form</h2>
      <div className="illustration"><i className="icon ion-ios-locked-outline" /></div>
      <div className="mb-3" />
      <div className="mb-3">
        <input className="form-control" onChange={this.handleChange} value={this.state.electionName} type="text" name="electionName" placeholder="Election Name" id="name" />
        <input className="form-control" onChange={this.handleChange} value = {this.state.candidateA} type="text" placeholder="Candidate A" name="candidateA" id="candidateA" />
        <input className="form-control" onChange={this.handleChange} value={this.state.candidateB} type="text" placeholder="Candidate B" name="candidateB" id="candidateB" /></div>
        <div className="mb-3">
        <div><p>Select an Account: </p> 
                <Select  label="Select an Account"
                        theme={(theme) => ({
                                ...theme,
                                borderRadius: 0,
                                colors: {
                                ...theme.colors,
                                text: 'orangered',
                                neutral0: 'black',
                                primary25: 'hotpink',
                                primary: 'black',
                              },
                        })}
                        options={this.state.accountLabels} onChange={this.handleAccountChange}/>

            </div>
            </div>
      <div className="mb-3"><Button variant="btn btn-outline-success d-block w-100" onClick={this.conductElection} disabled={this.state.account == null}>{this.state.account == null ? 'Select an Account first':'Conduct Election'}</Button></div><a className="forgot" href="#">Rayyan Jafri</a>
                 
      <div className="mb-3"></div>      
      <Button variant="btn btn-outline-danger d-block w-100" type="sm" onClick={this.getAccounts}>{this.state.accountLoaded ? 'Refresh Accounts' : 'Get Accounts'}</Button>
                      
    </form>
  </section>
  <transactionresult />
</div>
    );
  }
}
export default App;