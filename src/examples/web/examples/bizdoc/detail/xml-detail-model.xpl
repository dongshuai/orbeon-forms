<p:config xmlns:p="http://www.orbeon.com/oxf/pipeline"
    xmlns:oxf="http://www.orbeon.com/oxf/processors">

    <p:param name="instance" type="input"/>

    <!-- Call the data access layer -->
    <p:processor name="oxf:pipeline">
        <p:input name="config" href="../data-access/delegate/read-document.xpl"/>
        <p:input name="document-id" href="#instance#xpointer(/document-id)"/>
        <p:output name="document-info" id="document"/>
    </p:processor>

    <p:processor name="oxf:xml-serializer">
        <p:input name="data" href="#document#xpointer(/*/document/*)"/>
        <p:input name="config">
            <config>
                <content-type>application/xml</content-type>
            </config>
        </p:input>
    </p:processor>

</p:config>