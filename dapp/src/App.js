import './assets/css/Login-Form-Dark.css';
import './assets/css/styles.css';

const { initialize } = require('zokrates-js');
function App() {
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
            <li className="nav-item"><a className="nav-link active" href="/conductElection" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Conduct Election</a></li>
            <li className="nav-item"><a className="nav-link" href="/generateVoteKey" style={{color: 'var(--bs-yellow)', fontFamily: '"Alfa Slab One", serif'}}>Generate Vote Key</a></li>
            <li className="nav-item"><a className="nav-link" href="/submitVote" style={{fontFamily: '"Alfa Slab One", serif', color: 'var(--bs-yellow)'}}>Submit Vote</a></li>
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
        <input className="form-control" type="text" name="electionName" placeholder="Election Name" id="name" />
        <input className="form-control" type="text" placeholder="Candidate A" name="candidateA" id="candidateA" />
        <input className="form-control" type="text" placeholder="Candidate B" name="candidateB" id="candidateB" /></div>
      <div className="mb-3"><button className="btn btn-outline-secondary d-block w-100" type="submit" onclick="conductElection(name.value, candidateA.value, candidateB.value)">&nbsp;Conduct Election</button></div><a className="forgot" href="#">Rayyan Jafri</a>
    </form>
  </section>
  <transactionresult />
</div>

  );
}

export default App;
