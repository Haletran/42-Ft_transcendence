import { Page } from '../src/pages.js';

export class Profile extends Page {
    constructor() {
        super();
        this.template = `
            <div class="header">
        <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand " href="/" data-link="/">
                    <img src="/static/imgs/logo.png" alt="" width="25" class="d-inline-block align-text-top invert">
                    <p class="d-inline montserrat-bold">Ft_transcendence</p>
                </a>
                <a class="nav-link active" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img alt="Logo" width="40" height="40" class="rounded-circle" style="
                              object-fit: cover;
                            " src="https://cdn.intra.42.fr/users/65ca7a946948378f5cf99fb253ea4907/bapasqui.jpg"
                        alt="profile_picture" />
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                        <a class="dropdown-item" href="/profile" data-link="/profile">Profile</a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="/settings" data-link="/settings" >Settings</a>
                    </li>
                    <li>
                        <a class="dropdown-item fw-bold text-danger" href="/chat" data-link="/chat" >Logout</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    <div class="container mt-5">
        <div class="row gap-3">
            <div class="col-md-4">
                <div class="list-group">
                    <a id="choose_param"  href="/profile" data-link="/profile"
                        class="list-group-item list-group-item-action active" aria-current="true">
                        Profile
                    </a>
                    <a id="choose_param" data-link="/settings" 
                        class="list-group-item list-group-item-action">Settings</a>
                    <a id="choose_param" href="/chat" data-link="/chat"
                        class="list-group-item list-group-item-action">Messages</a>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Profile Information</h5>
                        <p class="card-text">Here you can update your profile information.</p>
                        <div class="form-floating mb-3">
                            <input type="email" value="test@test.fr" class="form-control" id="floatingInput"
                                placeholder="name@example.com">
                            <label for="floatingInput">Email address</label>
                        </div>
                        <div class="form-floating">
                            <input type="password" value="*************" class="form-control" id="floatingPassword"
                                placeholder="Password">
                            <label for="floatingPassword">Password</label>
                        </div>
                        <br>
                        <h5 class="card-title">Profile Picture</h5>
                        <p class="card-text">Here you can update your profile picture.</p>
                        <div id="choice_pp" class="d-flex justify-content-center">
                            <img id="actual_pp"
                                src="https://cdn.intra.42.fr/users/65ca7a946948378f5cf99fb253ea4907/bapasqui.jpg"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.asterix.com%2Fillus%2Fasterix-de-a-a-z%2Fles-personnages%2Fperso%2Fg09b.gif&f=1&nofb=1&ipt=cfac469a6be48f3e2605046abda8e951dca4d7df0fe992f3671dbb2a8f138bef&ipo=images"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2Fa%2FAGF-l7--byG5GmricLArCBG8Z22vUh_aBty7iBuE_g%3Ds900-c-k-c0xffffffff-no-rj-mo&f=1&nofb=1&ipt=1a23ae84ed1fc659ca24019a82eb57172bb67fd39011b10a447dd4267ce972f5&ipo=images"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.anniversaire-celebrite.com%2Fupload%2F250x333%2Fgaston-lagaffe-250.jpg&f=1&nofb=1&ipt=53a428ca710bb37ea8805c2cb05bb36d77f0f755da02d93de43d40fa78b0eeb2&ipo=images"
                                alt="profile_picture" class="rounded-circle pp">
                            <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2Fa0%2F30%2F4f%2Fa0304f8b33cf2c7a891dcc970133d58a.jpg&f=1&nofb=1&ipt=0f6532af6f67a73c91a735320257aba21c7aed6e50a5c957d79e3da29ec1a188&ipo=images"
                                alt="profile_picture" class="rounded-circle pp">
                        </div>
                        <button id="update_info" type="button" class="btn btn-primary mt-3">Update</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="toast align-items-center position-fixed bottom-0 end-0" role="alert" aria-live="assertive"
            aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    Profile successfully updated!
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div>
    `
    ;
    }
    render() {
        super.render(); // Call the parent render method
    }
}