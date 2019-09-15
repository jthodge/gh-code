import { autoBind, Choose } from "react-extras";
import { Component, FormEvent } from "react";
import { withRouter, SingletonRouter } from "next/router";
import {
  Heading,
  IconButton,
  minorScale,
  Pane,
  TextInput,
  Tooltip
} from "evergreen-ui";
import ClickOutHandler from "react-onclickout";

import { withData } from "../../hocs/with-data";
import { Repo } from "../../../common/interfaces/repo.interface";
import { Data } from "../../../common/interfaces/data.interface";

interface EditableTitleProps extends Data {
  repo: Repo;
  router: SingletonRouter;
  updateRepo(repo: Repo): void;
}

interface EditableTitleState {
  editing: boolean;
}

class EditableTitle extends Component<EditableTitleProps, EditableTitleState> {
  constructor(props: EditableTitleProps) {
    super(props);
    autoBind(this);

    this.state = {
      editing: false
    };
  }

  input: HTMLInputElement;

  focus() {
    this.input.focus && this.input.focus();
  }

  updateName(value: string) {
    const { repo, updateRepo } = this.props;

    repo.name = value;
    updateRepo(repo);
  }

  navigateHome() {
    const { router } = this.props;

    router.push("/");
  }

  onSubmit(e: FormEvent) {
    e.stopPropagation();
    this.setState({ editing: false });
  }

  render() {
    const { editing } = this.state;
    const { repo } = this.props;
    const value = repo.name;

    return (
      <Pane
        marginBottom={16}
        marginTop={16}
        width={"100%"}
        display={"inline-flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Tooltip content="Back to Repositories">
          <IconButton
            flexShrink={0}
            onClick={this.navigateHome}
            icon="arrow-left"
          />
        </Tooltip>
        <Choose>
          <Choose.When condition={editing}>
            <ClickOutHandler
              onClickOut={() => this.setState({ editing: false })}
            >
              <form
                onSubmit={this.onSubmit}
                style={{
                  display: "flex-inline",
                  marginLeft: minorScale(3),
                  flex: 1
                }}
              >
                <TextInput
                  innerRef={(ref: HTMLInputElement) => {
                    this.input = ref;
                  }}
                  height={32}
                  onChange={(e: any) => this.updateName(e.target.value)}
                  placeholder={"github/electron"}
                  spellCheck={false}
                  value={value}
                  width={"100%"}
                />
              </form>
            </ClickOutHandler>
          </Choose.When>
          <Choose.Otherwise>
            <Heading
              marginLeft={minorScale(3)}
              onClick={() =>
                this.setState({ editing: true }, () => this.focus())
              }
              cursor={"pointer"}
              textDecoration={"underline"}
              size={600}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
              flexGrow={1}
            >
              {value}
            </Heading>
            <Tooltip content="Edit the name">
              <IconButton
                flexShrink={0}
                marginLeft={minorScale(3)}
                height={24}
                onClick={() =>
                  this.setState({ editing: true }, () => this.focus())
                }
                icon="edit"
              />
            </Tooltip>
          </Choose.Otherwise>
        </Choose>
      </Pane>
    );
  }
}

export default withRouter(withData(EditableTitle));
